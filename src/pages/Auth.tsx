import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Scissors } from "lucide-react";
import { signInSchema, signUpSchema } from "@/lib/validation-schemas";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { EmailValidator } from "@/components/auth/email-validator";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [barbershopName, setBarbershopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = signInSchema.parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "❌ Erro no login",
            description: "E-mail ou senha incorretos. Verifique seus dados e tente novamente, ou use a opção 'Esqueceu a senha?' caso necessário.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "⚠️ E-mail não confirmado",
            description: "Por favor, verifique seu e-mail e clique no link de confirmação antes de fazer login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "❌ Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "✅ Login realizado com sucesso!",
          description: "Bem-vindo ao CutSync Pro. Redirecionando...",
        });
      }
    } catch (error: any) {
      if (error.errors) {
        const validationError = error.errors[0];
        toast({
          title: "⚠️ Dados inválidos",
          description: validationError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erro no login",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = signUpSchema.parse({
        email,
        password,
        fullName,
        barbershopName,
      });

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: validatedData.fullName,
            barbershop_name: validatedData.barbershopName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "⚠️ Usuário já cadastrado",
            description: "Este e-mail já está registrado. Faça login ou recupere sua senha.",
            variant: "destructive",
          });
        } else if (error.message.includes("Password should be at least")) {
          toast({
            title: "⚠️ Senha fraca",
            description: "A senha deve atender aos requisitos mínimos de segurança.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "❌ Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "✅ Cadastro realizado com sucesso!",
          description: "Verifique seu e-mail para confirmar sua conta e começar a usar o CutSync Pro.",
        });
        // Clear form
        setEmail("");
        setPassword("");
        setFullName("");
        setBarbershopName("");
      }
    } catch (error: any) {
      if (error.errors) {
        const validationError = error.errors[0];
        toast({
          title: "⚠️ Dados inválidos",
          description: validationError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erro no cadastro",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast({
        title: "❌ Erro na recuperação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "✅ E-mail enviado com sucesso!",
        description: "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.",
      });
      setShowResetForm(false);
      setResetEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Scissors className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">CutSync Pro</CardTitle>
          <CardDescription>
            Sistema de agendamento para barbearias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowEmailValidation(true);
                    }}
                    onBlur={() => setShowEmailValidation(true)}
                    required
                  />
                  <EmailValidator email={email} showValidation={showEmailValidation} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <div className="text-center mt-4">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={() => setShowResetForm(true)}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
              </form>
              {showResetForm && (
                <form onSubmit={handleResetPassword} className="space-y-4 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email para recuperação</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbershopName">Nome da barbearia</Label>
                  <Input
                    id="barbershopName"
                    value={barbershopName}
                    onChange={(e) => setBarbershopName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowEmailValidation(true);
                    }}
                    onBlur={() => setShowEmailValidation(true)}
                    required
                  />
                  <EmailValidator email={email} showValidation={showEmailValidation} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Senha</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <PasswordStrengthIndicator password={password} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;