/**
 * Utility functions for WhatsApp integration
 */

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present (assuming Brazil +55)
  if (digits.length === 11 && digits.startsWith('11')) {
    return `55${digits}`;
  } else if (digits.length === 10) {
    return `5511${digits}`;
  } else if (digits.length === 13 && digits.startsWith('55')) {
    return digits;
  }
  
  return digits;
};

export const generateBookingMessage = (booking: {
  clientName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  price: number;
  phone: string;
}) => {
  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR');
  
  return `🗓️ *AGENDAMENTO CONFIRMADO*

📋 *Detalhes do Agendamento:*
👤 Cliente: ${booking.clientName}
✂️ Serviço: ${booking.serviceName}
👨‍💼 Profissional: ${booking.professionalName}
📅 Data: ${formattedDate}
⏰ Horário: ${booking.time}
💰 Valor: R$ ${booking.price.toFixed(2)}

📱 WhatsApp: ${booking.phone}

✅ Agendamento realizado através do AgendaFácil

Para alterar ou cancelar, entre em contato conosco!`;
};

export const generateReminderMessage = (booking: {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  barbershopName?: string;
}) => {
  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR');
  
  return `⏰ *LEMBRETE DE AGENDAMENTO*

Olá ${booking.clientName}! 

🗓️ Seu agendamento é amanhã:
✂️ Serviço: ${booking.serviceName}
📅 Data: ${formattedDate}
⏰ Horário: ${booking.time}

${booking.barbershopName ? `📍 ${booking.barbershopName}` : ''}

Te esperamos! Em caso de imprevistos, favor avisar com antecedência.

Obrigado! 💈`;
};

export const generateConfirmationMessage = (booking: {
  clientName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  barbershopName?: string;
  address?: string;
}) => {
  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR');
  
  return `✅ *AGENDAMENTO CONFIRMADO*

Olá ${booking.clientName}!

Seu agendamento foi confirmado:
✂️ Serviço: ${booking.serviceName}
👨‍💼 Profissional: ${booking.professionalName}
📅 Data: ${formattedDate}
⏰ Horário: ${booking.time}

${booking.barbershopName ? `📍 ${booking.barbershopName}` : ''}
${booking.address ? `🗺️ ${booking.address}` : ''}

Te esperamos! Para cancelar ou reagendar, entre em contato conosco.

Obrigado! 💈`;
};