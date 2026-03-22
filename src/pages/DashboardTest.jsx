export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-500 text-white p-6 rounded-lg text-center">
          <h1 className="text-3xl font-bold">✅ TEST RÉUSSI !</h1>
          <p className="mt-2 text-lg">Si vous voyez ceci, React fonctionne parfaitement</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600">Composant Simple</h2>
            <p className="mt-2 text-gray-600">Aucune dépendance complexe</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-600">CSS Fonctionnel</h2>
            <p className="mt-2 text-gray-600">Tailwind CSS chargé</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-purple-600">Routing OK</h2>
            <p className="mt-2 text-gray-600">React Router fonctionne</p>
          </div>
        </div>

        <div className="mt-8 bg-red-100 border border-red-300 p-4 rounded">
          <h3 className="text-red-800 font-semibold">🔍 Test de Débogage</h3>
          <p className="text-red-700 mt-1">Si cette page s'affiche, le problème vient des hooks ou APIs dashboard</p>
        </div>
      </div>
    </div>
  );
}