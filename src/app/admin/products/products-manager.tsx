"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  categoryId: string;
  image: string;
  stock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
  category: Category;
};

const emptyForm = {
  name: "",
  description: "",
  price: "100",
  compareAt: "",
  categoryId: "",
  image: "/images/brand/photo-1.jpg",
  stock: "20",
  unit: "piece",
  isActive: true,
  isFeatured: false,
  tags: "",
};

export function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      compareAt: p.compareAt != null ? String(p.compareAt) : "",
      categoryId: p.categoryId,
      image: p.image,
      stock: String(p.stock),
      unit: p.unit,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      tags: p.tags,
    });
    setOpen(true);
  }

  async function save() {
    const payload = {
      ...form,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      stock: Number(form.stock),
    };

    if (editing) {
      const res = await fetch(`/api/admin/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Update failed");
      const category = categories.find((c) => c.id === data.categoryId)!;
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...data, category } : p)),
      );
      toast.success("Product updated");
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Create failed");
      const category = categories.find((c) => c.id === data.categoryId)!;
      setProducts((prev) => [{ ...data, category }, ...prev]);
      toast.success("Product created");
    }
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Products</h1>
          <p className="text-sm text-[var(--brand-ink)]/60">Prices, categories, stock, and images</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="bg-[var(--brand-chili)] hover:bg-[#6f1717]" onClick={openCreate} />}
          >
            Add product
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Price</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Compare at</Label>
                  <Input
                    value={form.compareAt}
                    onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Stock</Label>
                  <Input
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    disabled={!!editing}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Unit</Label>
                  <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Image path</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
                />
              </div>
              <Button className="bg-[var(--brand-chili)]" onClick={save}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border border-[#e0cdb4] bg-[#fffaf3]">
        <table className="w-full text-sm">
          <thead className="bg-[#efe2cf] text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Flags</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#e0cdb4]">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-[var(--brand-ink)]/50">{p.isActive ? "Active" : "Hidden"}</div>
                </td>
                <td className="p-3">{p.category.name}</td>
                <td className="p-3">{formatPKR(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.isFeatured ? "Featured" : "—"}</td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
