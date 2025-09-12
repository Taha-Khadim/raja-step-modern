import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

export const PhoneVerification = ({ onVerified, onCancel }: PhoneVerificationProps) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      // Validate phone number format
      if (!isValidPhoneNumber(phoneNumber, 'PK')) {
        toast.error('Please enter a valid Pakistani phone number');
        return;
      }

      const parsedNumber = parsePhoneNumber(phoneNumber, 'PK');
      const formattedNumber = parsedNumber?.format('E.164');

      setLoading(true);
      const { data, error } = await db.sendPhoneVerification(formattedNumber!);
      
      if (error) throw error;

      toast.success('Verification code sent to your phone');
      setStep('code');
      
      // For development, show the code in console
      if (data?.code) {
        console.log('Verification code:', data.code);
        toast.info(`Development: Code is ${data.code}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      const parsedNumber = parsePhoneNumber(phoneNumber, 'PK');
      const formattedNumber = parsedNumber?.format('E.164');

      setLoading(true);
      const { data, error } = await db.verifyPhone(formattedNumber!, verificationCode);
      
      if (error) throw error;

      if (data?.success) {
        toast.success('Phone number verified successfully');
        onVerified(formattedNumber!);
      } else {
        toast.error(data?.message || 'Invalid verification code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Verification</CardTitle>
        <CardDescription>
          {step === 'phone' 
            ? 'Enter your phone number to receive a verification code'
            : 'Enter the verification code sent to your phone'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Pakistani phone number with country code
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendCode} disabled={loading} className="flex-1">
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep('phone')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerifyCode} disabled={loading} className="flex-1">
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};