"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { 
  useGetClientsQuery, 
  useDeleteClientMutation,
  Client
} from "@/services/clientsApi";

export default function ClientsPage() {
  const { data: clients, isLoading, refetch } = useGetClientsQuery();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(id).unwrap();
      await refetch();
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/clients/edit/${id}`);
  };

  const handleAdd = () => {
    router.push("/clients/new");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление клиентами</h1>
        <Button onClick={handleAdd}>Добавить клиента</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : !clients || clients.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-lg mb-4">Нет данных о клиентах</p>
          <Button onClick={handleAdd}>Добавить первого клиента</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-3 text-left">Имя</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Компания</th>
                <th className="px-4 py-3 text-left">Телефоны</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    {client.name}
                  </td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">{client.company}</td>
                  <td className="px-4 py-3">
                    {client.phones.map((phone) => (
                      <div key={phone.id}>{phone.number}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client.id)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        disabled={isDeleting}
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 