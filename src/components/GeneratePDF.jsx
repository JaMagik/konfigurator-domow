import autoTable from "jspdf-autotable";
import { ZAKRES_DOMU } from "../data/domy";

const { jsPDF } = window.jspdf;

const GeneratePDF = ({ dom, klient }) => {
  const handleGenerate = async () => {
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      doc.setFont("OpenSans-Medium", "normal");

      const addImagePage = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            doc.addImage(img, "PNG", 0, 0, 210, 297);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Nie można załadować obrazu: ${src}`);
            resolve();
          };
        });

      // Strony 1-3: statyczne grafiki
      await addImagePage(`/pdfpages/${dom.id}/start.png`);
      doc.addPage();
      await addImagePage(`/pdfpages/${dom.id}/info.png`);
      doc.addPage();
      await addImagePage(`/pdfpages/${dom.id}/info2.png`);

      // Strony 4-6: warianty
      const warianty = [
        { name: "Podstawowy", cena: dom.ceny.podstawowa, cenaM2: dom.cenaZaM2.podstawowa },
        { name: "Standard", cena: dom.ceny.standard, cenaM2: dom.cenaZaM2.standard },
        { name: "Premium", cena: dom.ceny.premium, cenaM2: dom.cenaZaM2.premium }
      ];

      for (const wariant of warianty) {
        doc.addPage();

        doc.setFillColor(4, 178, 0);
        doc.rect(0, 0, 210, 30, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text(`OFERTA – WARIANT ${wariant.name.toUpperCase()}`, 105, 20, { align: "center" });

        doc.setTextColor(0);
        doc.setFont("OpenSans-Medium", "normal");
        doc.setFontSize(12);
        doc.text(`Imię i nazwisko: ${klient.imie} ${klient.nazwisko}`, 14, 40);
        doc.text(`Model domu: ${dom.nazwa}`, 14, 48);

        doc.setFontSize(14);
        doc.text("Szczegóły cenowe", 14, 65);
        autoTable(doc, {
          startY: 70,
          theme: "grid",
          headStyles: { fillColor: [4, 178, 0], fontSize: 11, fontStyle: "normal", halign: "center" },
          styles: {
            fontSize: 10,
            font: "OpenSans-Medium",
            fontStyle: "normal",
            cellPadding: 2.5,
            lineWidth: 0.2,
            lineColor: [180, 180, 180],
            overflow: "linebreak"
          },
          head: [["Cena całkowita (zł)", "Cena za m² (zł)"]],
          body: [[wariant.cena.toLocaleString(), wariant.cenaM2]]
        });

        const zakresStart = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text("Zakres oferty:", 14, zakresStart);
        autoTable(doc, {
          startY: zakresStart + 5,
          theme: "grid",
          headStyles: { fillColor: [4, 178, 0], fontSize: 11, fontStyle: "normal", halign: "center" },
          styles: {
            fontSize: 10,
            font: "OpenSans-Medium",
            fontStyle: "normal",
            cellPadding: 2.5,
            lineWidth: 0.2,
            lineColor: [180, 180, 180],
            overflow: "linebreak"
          },
          body: ZAKRES_DOMU[wariant.name.toLowerCase()].map((item) => [item])
        });
      }

      // Strony 7-8: rzuty + kontakt
      await addImagePage(`/pdfpages/${dom.id}/rzut1.png`);
      doc.addPage();
      await addImagePage(`/pdfpages/${dom.id}/rzut2.png`);
      doc.addPage();
      await addImagePage(`/pdfpages/${dom.id}/kontakt.png`);

      doc.save(`Oferta_KamanHome_${klient.imie}_${klient.nazwisko}.pdf`);
    } catch (error) {
      console.error("Błąd generowania PDF:", error);
      alert("Nie udało się wygenerować PDF. Sprawdź konsolę.");
    }
  };

  return (
    <button
      onClick={handleGenerate}
      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
    >
      Pobierz pełną ofertę PDF
    </button>
  );
};

export default GeneratePDF;
