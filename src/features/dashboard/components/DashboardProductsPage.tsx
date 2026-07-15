"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { ActiveBadge } from "@/features/dashboard/components/AdminModal";
import { AdminConfirmDrawer } from "@/features/dashboard/components/AdminConfirmDrawer";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { ProductFormModal } from "@/features/dashboard/components/ProductFormModal";
import { getApiErrorMessage } from "@/store/api/errors";
import type { ApiAdminProduct, CreateProductInput } from "@/store/api/types";
import {
  useAdminCreateProductMutation,
  useAdminDeleteProductMutation,
  useAdminListCategoriesQuery,
  useAdminListProductsQuery,
  useAdminUpdateProductMutation,
} from "@/store/slices";

type StatusFilter = "all" | "active" | "hidden";

export function DashboardProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiAdminProduct | null>(null);
  const [deletingItem, setDeletingItem] = useState<ApiAdminProduct | null>(
    null,
  );
  const [actionError, setActionError] = useState("");

  const { data: categoriesData } = useAdminListCategoriesQuery({
    page: 1,
    limit: 50,
  });
  const categories = categoriesData?.items ?? [];

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 10,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(status === "active"
        ? { isActive: true }
        : status === "hidden"
          ? { isActive: false }
          : {}),
      ...(stockOnly ? { inStock: true } : {}),
      ...(featuredOnly ? { featured: true } : {}),
    }),
    [
      page,
      deferredSearch,
      categoryId,
      status,
      stockOnly,
      featuredOnly,
    ],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminListProductsQuery(queryArgs);
  const [createProduct, { isLoading: creating }] =
    useAdminCreateProductMutation();
  const [updateProduct, { isLoading: updating }] =
    useAdminUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] =
    useAdminDeleteProductMutation();

  const items = data?.items ?? [];
  const meta = data?.meta;

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
    setActionError("");
  }

  function openEdit(product: ApiAdminProduct) {
    setEditing(product);
    setModalOpen(true);
    setActionError("");
  }

  async function handleSubmit(body: CreateProductInput) {
    if (editing) {
      await updateProduct({ id: editing.id, body }).unwrap();
    } else {
      await createProduct(body).unwrap();
    }
  }

  function askDelete(product: ApiAdminProduct) {
    setActionError("");
    setDeletingItem(product);
  }

  async function confirmDelete() {
    if (!deletingItem) return;
    setActionError("");
    try {
      await deleteProduct(deletingItem.id).unwrap();
      setDeletingItem(null);
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not delete product."));
      setDeletingItem(null);
    }
  }

  async function toggleActive(product: ApiAdminProduct) {
    setActionError("");
    try {
      await updateProduct({
        id: product.id,
        body: { isActive: !product.isActive },
      }).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update product."));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Products
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Catalog for the shop. Filters apply to the table below.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
        >
          Add product
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#e8ddd2] bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or slug…"
            className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#c4a574] lg:max-w-xs"
          />
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#ddd0c4] bg-white px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none focus:border-[#c4a574] lg:max-w-[14rem]"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["active", "Active"],
                ["hidden", "Hidden"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setStatus(value);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  status === value
                    ? "bg-[#2a1f16] text-white"
                    : "bg-[#F6EDE6] text-[#5c4f43] hover:bg-[#efe4da]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[#5c4f43]">
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) => {
                setStockOnly(e.target.checked);
                setPage(1);
              }}
              className="size-3.5 rounded border-[#ddd0c4] accent-[#c4a574]"
            />
            In stock only
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[#5c4f43]">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => {
                setFeaturedOnly(e.target.checked);
                setPage(1);
              }}
              className="size-3.5 rounded border-[#ddd0c4] accent-[#c4a574]"
            />
            Featured only
          </label>
        </div>
      </div>

      {actionError ? (
        <p className="text-sm text-[#a35d5d]" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={isFetching && !isLoading ? "opacity-60" : undefined}
            >
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    Loading products…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-[#a35d5d]">
                      {getApiErrorMessage(error, "Failed to load products.")}
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 text-sm font-medium text-[#c4a574] hover:text-[#2a1f16]"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    No products match these filters.
                  </td>
                </tr>
              ) : (
                items.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                          <Image
                            src={product.imagePath}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2a1f16]">
                            {product.name}
                            {product.isFeatured ? (
                              <span className="ml-2 rounded-full bg-[#F6EDE6] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#b0895b] uppercase">
                                Featured
                              </span>
                            ) : null}
                          </p>
                          <p className="truncate text-xs text-[#8a7a6c]">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#2a1f16]">
                        QAR {product.finalPrice.toFixed(2)}
                      </p>
                      {product.finalPrice !== product.price ? (
                        <p className="text-xs text-[#8a7a6c] line-through">
                          QAR {product.price.toFixed(2)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      <span
                        className={
                          product.inStock ? undefined : "text-[#a35d5d]"
                        }
                      >
                        {product.quantity}
                        {!product.inStock ? " · out" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ActiveBadge active={product.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(product)}
                          disabled={updating || deleting}
                          className="text-xs font-medium text-[#7a6b5d] hover:text-[#2a1f16] disabled:opacity-50"
                        >
                          {product.isActive ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => askDelete(product)}
                          disabled={deleting}
                          className="text-xs font-medium text-[#a35d5d] hover:text-[#7a3030] disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta ? (
          <AdminPagination meta={meta} onPageChange={setPage} />
        ) : null}
      </div>

      <ProductFormModal
        open={modalOpen}
        initial={editing}
        categories={categories}
        saving={creating || updating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <AdminConfirmDrawer
        open={Boolean(deletingItem)}
        title="Delete product?"
        description={
          deletingItem
            ? `“${deletingItem.name}” will be removed permanently. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          if (!deleting) setDeletingItem(null);
        }}
      />
    </div>
  );
}
