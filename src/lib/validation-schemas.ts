import { z } from "zod";

// Authentication schemas
export const signInSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).max(128, { message: "Senha deve ter menos de 128 caracteres" }),
});

export const signUpSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).max(128, { message: "Senha deve ter menos de 128 caracteres" }),
  fullName: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome deve ter menos de 100 caracteres" }),
  barbershopName: z.string().trim().min(2, { message: "Nome da barbearia deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome da barbearia deve ter menos de 100 caracteres" }),
});

// Booking schemas
export const clientDataSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome deve ter menos de 100 caracteres" }),
  phone: z.string().trim().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }).max(15, { message: "Telefone deve ter menos de 15 caracteres" }).regex(/^[\d\s\(\)\-\+]+$/, { message: "Telefone deve conter apenas números e símbolos válidos" }),
});

export const appointmentSchema = z.object({
  clientName: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome deve ter menos de 100 caracteres" }),
  clientPhone: z.string().trim().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }).max(15, { message: "Telefone deve ter menos de 15 caracteres" }).regex(/^[\d\s\(\)\-\+]+$/, { message: "Telefone deve conter apenas números e símbolos válidos" }),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data deve estar no formato YYYY-MM-DD" }),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Horário deve estar no formato HH:MM" }),
  serviceId: z.string().uuid({ message: "ID do serviço inválido" }),
  professionalId: z.string().uuid({ message: "ID do profissional inválido" }),
  userId: z.string().uuid({ message: "ID do usuário inválido" }),
});

// Company/Profile schemas
export const companyFormSchema = z.object({
  barbershopName: z.string().trim().min(2, { message: "Nome da barbearia deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome da barbearia deve ter menos de 100 caracteres" }),
  fullName: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome deve ter menos de 100 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "Email deve ter menos de 255 caracteres" }).optional().or(z.literal("")),
  phone: z.string().trim().max(15, { message: "Telefone deve ter menos de 15 caracteres" }).regex(/^[\d\s\(\)\-\+]*$/, { message: "Telefone deve conter apenas números e símbolos válidos" }).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(15, { message: "WhatsApp deve ter menos de 15 caracteres" }).regex(/^[\d\s\(\)\-\+]*$/, { message: "WhatsApp deve conter apenas números e símbolos válidos" }).optional().or(z.literal("")),
  address: z.string().trim().max(200, { message: "Endereço deve ter menos de 200 caracteres" }).optional().or(z.literal("")),
  description: z.string().trim().max(500, { message: "Descrição deve ter menos de 500 caracteres" }).optional().or(z.literal("")),
});

// Service schemas
export const serviceSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome do serviço deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome do serviço deve ter menos de 100 caracteres" }),
  price: z.number().min(0, { message: "Preço deve ser positivo" }).max(9999.99, { message: "Preço deve ser menor que R$ 9.999,99" }),
  duration_minutes: z.number().min(5, { message: "Duração deve ser pelo menos 5 minutos" }).max(480, { message: "Duração deve ser menor que 8 horas" }),
});

// Professional schemas
export const professionalSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome do profissional deve ter pelo menos 2 caracteres" }).max(100, { message: "Nome do profissional deve ter menos de 100 caracteres" }),
  workDays: z.array(z.string()).min(1, { message: "Selecione pelo menos um dia de trabalho" }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Horário deve estar no formato HH:MM" }),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Horário deve estar no formato HH:MM" }),
});

// WhatsApp message validation
export const whatsappMessageSchema = z.object({
  phoneNumber: z.string().trim().min(10, { message: "Número de telefone deve ter pelo menos 10 dígitos" }).max(15, { message: "Número de telefone deve ter menos de 15 caracteres" }).regex(/^[\d\+]+$/, { message: "Número deve conter apenas dígitos e +" }),
  message: z.string().trim().min(1, { message: "Mensagem não pode estar vazia" }).max(1000, { message: "Mensagem deve ter menos de 1000 caracteres" }),
});

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type ClientData = z.infer<typeof clientDataSchema>;
export type AppointmentData = z.infer<typeof appointmentSchema>;
export type CompanyFormData = z.infer<typeof companyFormSchema>;
export type ServiceData = z.infer<typeof serviceSchema>;
export type ProfessionalData = z.infer<typeof professionalSchema>;
export type WhatsAppMessageData = z.infer<typeof whatsappMessageSchema>;