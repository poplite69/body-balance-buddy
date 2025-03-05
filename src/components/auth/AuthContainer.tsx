
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import AuthHeader from './AuthHeader';

interface AuthContainerProps {
  defaultTab: string;
  redirectAfterAuth: () => void;
}

const AuthContainer = ({ defaultTab, redirectAfterAuth }: AuthContainerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <AuthHeader />
      
      <Card className="w-full max-w-md">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm redirectAfterAuth={redirectAfterAuth} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthContainer;
