import { useState } from "react";
import { DOMY } from "./data/domy";
import GeneratePDF from "./components/GeneratePDF";


const App = () => {
  const [formData, setFormData] = useState({ imie: "", nazwisko: "", dom: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const znalezionyDom = DOMY.find((d) => d.id === formData.dom);
    if (!znalezionyDom) {
      alert("Wybierz poprawny model domu");
      return;
    }

    // Programowo kliknij przycisk wygenerowania PDF
    const container = document.createElement("div");
    document.body.appendChild(container);

    const renderPDF = GeneratePDF({ dom: znalezionyDom, klient: formData });
    renderPDF.props.onClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Imię</label>
          <input
            type="text"
            name="imie"
            value={formData.imie}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nazwisko</label>
          <input
            type="text"
            name="nazwisko"
            value={formData.nazwisko}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wybierz dom</label>
          <select
            name="dom"
            value={formData.dom}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          >
            <option value="">-- wybierz --</option>
            {DOMY.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nazwa}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Wygeneruj ofertę
        </button>
      </form>
    </div>
  );
};

export default App;
