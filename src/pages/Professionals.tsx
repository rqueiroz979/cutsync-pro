import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  work_days: string[];
  start_time: string;
  end_time: string;
}

const DAYS = [
  { id: "monday", label: "Segunda" },
  { id: "tuesday", label: "Terça" },
  { id: "wednesday", label: "Quarta" },
  { id: "thursday", label: "Quinta" },
  { id: "friday", label: "Sexta" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    work_days: [] as string[],
    start_time: "09:00",
    end_time: "18:00",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadProfessionals();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("name");

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error("Error loading professionals:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const professionalData = {
        name: formData.name,
        work_days: formData.work_days,
        start_time: formData.start_time,
        end_time: formData.end_time,
        user_id: user.id,
      };

      if (editingProfessional) {
        const { error } = await supabase
          .from("professionals")
          .update(professionalData)
          .eq("id", editingProfessional.id);

        if (error) throw error;
        toast({ title: "Profissional atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from("professionals")
          .insert([professionalData]);

        if (error) throw error;
        toast({ title: "Profissional criado com sucesso!" });
      }

      setDialogOpen(false);
      setEditingProfessional(null);
      setFormData({ name: "", work_days: [], start_time: "09:00", end_time: "18:00" });
      loadProfessionals();
    } catch (error) {
      console.error("Error saving professional:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar profissional",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      work_days: professional.work_days,
      start_time: professional.start_time,
      end_time: professional.end_time,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este profissional?")) return;

    try {
      const { error } = await supabase
        .from("professionals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Profissional excluído com sucesso!" });
      loadProfessionals();
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir profissional",
        variant: "destructive",
      });
    }
  };

  const handleDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, work_days: [...formData.work_days, dayId] });
    } else {
      setFormData({ ...formData, work_days: formData.work_days.filter(d => d !== dayId) });
    }
  };

  const getDayLabels = (workDays: string[]) => {
    return workDays.map(day => DAYS.find(d => d.id === day)?.label).join(", ");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Profissionais</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProfessional(null);
                setFormData({ name: "", work_days: [], start_time: "09:00", end_time: "18:00" });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProfessional ? "Editar Profissional" : "Novo Profissional"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do profissional
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dias de Trabalho</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={formData.work_days.includes(day.id)}
                          onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                        />
                        <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Horário Início</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">Horário Fim</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Salvando..." : editingProfessional ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && professionals.length === 0 ? (
          <p>Carregando...</p>
        ) : professionals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum profissional cadastrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id}>
                <CardHeader>
                  <CardTitle>{professional.name}</CardTitle>
                  <CardDescription>
                    {getDayLabels(professional.work_days)}
                    <br />
                    {professional.start_time} - {professional.end_time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(professional)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(professional.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Professionals;