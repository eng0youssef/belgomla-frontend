import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveProducts, getProduct, createProduct, updateProduct } from "@/services/product";
import { CreateProductRequest } from "@/types/api";

export function useActiveProducts() {
  return useQuery({
    queryKey: ["active-products"],
    queryFn: getActiveProducts,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductRequest }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-products"] });
    },
  });
}
