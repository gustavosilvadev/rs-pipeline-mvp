import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddCandidateModal({ open, onClose }: Props) {
  const { addCandidate, jobs } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    location: "",
    source: "Direto",
    jobId: "",
    tags: "",
    proficiencyLevel: "Fluente" as "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCandidate({
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      jobId: formData.jobId || undefined,
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      location: "",
      source: "Direto",
      jobId: "",
      tags: "",
      proficiencyLevel: "Fluente",
    });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          aria-describedby={undefined}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden"
            style={{ maxWidth: 600, maxHeight: "90vh" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <Dialog.Title className="text-xl font-bold">Adicionar Candidato</Dialog.Title>
              <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ex: Professor de Inglês - Infantil"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Nível de Proficiência *
                  </label>
                  <select
                    value={formData.proficiencyLevel}
                    onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    <option>Básico</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                    <option>Fluente</option>
                    <option>Nativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Origem
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    <option>Direto</option>
                    <option>LinkedIn</option>
                    <option>Indicação</option>
                    <option>Site de Vagas</option>
                    <option>Indeed</option>
                    <option>Catho</option>
                    <option>Vagas.com</option>
                    <option>Redes Sociais</option>
                    <option>Universidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Associar à Vaga
                  </label>
                  <select
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    <option value="">Nenhuma (adicionar depois)</option>
                    {jobs.filter((j) => j.status === "open").map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Habilidades e Certificações (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Ex: TOEFL, Conversação, Cambridge YLE, Metodologias Ativas"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-bold hover:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Candidato
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
