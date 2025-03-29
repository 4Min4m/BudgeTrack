import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ShoppingList, ShoppingItem } from '../types';

const ShoppingLists: React.FC = () => {
  const [newListName, setNewListName] = React.useState('');
  const [newItemName, setNewItemName] = React.useState('');
  const { shoppingLists, addShoppingList, updateShoppingList, deleteShoppingList } = useStore();

  const handleCreateList = () => {
    if (newListName.trim()) {
      addShoppingList({
        id: crypto.randomUUID(),
        name: newListName,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setNewListName('');
    }
  };

  const handleAddItem = (list: ShoppingList) => {
    if (newItemName.trim()) {
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        name: newItemName,
        quantity: 1,
        completed: false,
      };
      updateShoppingList({
        ...list,
        items: [...list.items, newItem],
        updatedAt: new Date(),
      });
      setNewItemName('');
    }
  };

  const toggleItem = (list: ShoppingList, itemId: string) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateShoppingList({
      ...list,
      items: updatedItems,
      updatedAt: new Date(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Create New List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Shopping Lists</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreateList}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </button>
        </div>
      </div>

      {/* Shopping Lists */}
      <div className="space-y-4">
        {shoppingLists.map((list) => (
          <div key={list.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{list.name}</h3>
              <button
                onClick={() => deleteShoppingList(list.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Add Item */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleAddItem(list)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            {/* Items List */}
            <ul className="space-y-2">
              {list.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(list, item.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingLists;