"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { ActiveBadge } from "@/features/dashboard/components/AdminModal";
import { AdminPagination } from "@/features/dashboard/components/AdminPagination";
import { CategoryFormModal } from "@/features/dashboard/components/CategoryFormModal";
import { getApiErrorMessage } from "@/store/api/errors";
import type { ApiAdminCategory, CreateCategoryInput } from "@/store/api/types";
import {
  useAdminCreateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminListCategoriesQuery,
  useAdminUpdateCategoryMutation,
} from "@/store/slices";

type StatusFilter = "all" | "active" | "hidden";

export function DashboardCategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiAdminCategory | null>(null);
  const [actionError, setActionError] = useState("");

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 10,
      ...(deferredSearch ? { search: deferredSearch } : {}),
      ...(status === "active"
        ? { isActive: true }
        : status === "hidden"
          ? { isActive: false }
          : {}),
    }),
    [page, deferredSearch, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminListCategoriesQuery(queryArgs);
  const [createCategory, { isLoading: creating }] =
    useAdminCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] =
    useAdminUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] =
    useAdminDeleteCategoryMutation();

  const items = data?.items ?? [];
  const meta = data?.meta;

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
    setActionError("");
  }

  function openEdit(category: ApiAdminCategory) {
    setEditing(category);
    setModalOpen(true);
    setActionError("");
  }

  async function handleSubmit(body: CreateCategoryInput) {
    if (editing) {
      await updateCategory({ id: editing.id, body }).unwrap();
    } else {
      await createCategory(body).unwrap();
    }
  }

  async function handleDelete(category: ApiAdminCategory) {
    if (
      !window.confirm(
        `Delete “${category.name}”? This only works if it has no products.`,
      )
    ) {
      return;
    }
    setActionError("");
    try {
      await deleteCategory(category.id).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not delete category."));
    }
  }

  async function toggleActive(category: ApiAdminCategory) {
    setActionError("");
    try {
      await updateCategory({
        id: category.id,
        body: { isActive: !category.isActive },
      }).unwrap();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not update category."));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
            Categories
          </h2>
          <p className="mt-1 text-sm text-[#7a6b5d]">
            Manage collections shown in shop-by-category.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
        >
          Add category
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8ddd2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or slug…"
            className="w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] focus:border-[#c4a574]"
          />
        </div>
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

      {actionError ? (
        <p className="text-sm text-[#a35d5d]" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-[#FEF9F6] text-[11px] tracking-[0.12em] text-[#8a7a6c] uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Products</th>
                <th className="px-5 py-3 font-medium">Sort</th>
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
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    Loading categories…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-[#a35d5d]">
                      {getApiErrorMessage(error, "Failed to load categories.")}
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
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#8a7a6c]"
                  >
                    No categories match these filters.
                  </td>
                </tr>
              ) : (
                items.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t border-[#f0e7de] hover:bg-[#FEF9F6]/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#FEF9F6]">
                          <Image
                            src={category.imagePath}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2a1f16]">
                            {category.name}
                          </p>
                          <p className="truncate text-xs text-[#8a7a6c]">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {category.productCount}
                    </td>
                    <td className="px-5 py-4 text-[#5c4f43]">
                      {category.sortOrder}
                    </td>
                    <td className="px-5 py-4">
                      <ActiveBadge active={category.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(category)}
                          disabled={updating || deleting}
                          className="text-xs font-medium text-[#7a6b5d] hover:text-[#2a1f16] disabled:opacity-50"
                        >
                          {category.isActive ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="text-xs font-medium text-[#c4a574] hover:text-[#2a1f16]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
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

      <CategoryFormModal
        open={modalOpen}
        initial={editing}
        saving={creating || updating}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
