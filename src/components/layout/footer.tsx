export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold text-accent">AgendaFácil</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Sistema completo de agendamento e gestão para barbearias. 
              Desenvolvido especialmente para o mercado de Curitiba e região.
            </p>
            <div className="text-sm text-primary-foreground/60">
              © 2024 AgendaFácil. Todos os direitos reservados.
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-primary-foreground/80 hover:text-accent transition-colors">Funcionalidades</a></li>
              <li><a href="#pricing" className="text-primary-foreground/80 hover:text-accent transition-colors">Preços</a></li>
              <li><a href="#demo" className="text-primary-foreground/80 hover:text-accent transition-colors">Demonstração</a></li>
              <li><a href="#faq" className="text-primary-foreground/80 hover:text-accent transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-primary-foreground/80">📱 (41) 99999-8888</li>
              <li className="text-primary-foreground/80">✉️ contato@agendafacil.com</li>
              <li className="text-primary-foreground/80">📍 Curitiba, PR</li>
              <li><a href="#support" className="text-primary-foreground/80 hover:text-accent transition-colors">Central de Ajuda</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            Feito com ❤️ em Curitiba para barbearias que querem crescer
          </p>
        </div>
      </div>
    </footer>
  );
}