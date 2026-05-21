import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddJobModal({ open, onClose }: Props) {
  const { addJob } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "CLT" as "CLT" | "PJ",
    openings: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      ...formData,
      status: "open",
    });
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "CLT",
      openings: 1,
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
            style={{ maxWidth: 600 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <Dialog.Title className="text-xl font-bold">Adicionar Nova Vaga</Dialog.Title>
              <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Título da Vaga *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Professor de Inglês - Infantil"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ex: Educação Infantil"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Tipo de Contrato *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "CLT" | "PJ" })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Localização (Unidade) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo - Unidade Jardins"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Número de Vagas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) || 1 })}
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
                  Criar Vaga
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
