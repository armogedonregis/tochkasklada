export default function RelayCard() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Ворота</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Выключено
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Номер реле: 1</p>
          <p className="text-sm text-gray-500">Тип: GATE</p>
        </div>
        <div className="mt-6">
          <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Переключить
          </button>
        </div>
      </div>
    </div>
  )
} 