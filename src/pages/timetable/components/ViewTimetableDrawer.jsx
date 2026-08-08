import { X, Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";

import { getTimetable } from "../../../services/timetableAPI";

import TimetableGrid from "./TimetableGrid";

function ViewTimetableDrawer({
  open,
  timetable,
  onClose,
}) {
  const [fullTimetable, setFullTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Fetch complete timetable when opened
  // ==========================================

  useEffect(() => {
    if (!open || !timetable?._id) {
      setFullTimetable(null);
      return;
    }

    const loadTimetable = async () => {
      try {
        setLoading(true);

        const response = await getTimetable(
          timetable._id
        );

        // getTimetable should return axios response
        const data =
          response?.data?.data || response?.data || null;

        setFullTimetable(data);
      } catch (error) {
        console.error(
          "Unable to load timetable:",
          error
        );

        // Fallback to the timetable from the list
        setFullTimetable(timetable);
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
  }, [open, timetable]);

  if (!open || !timetable) {
    return null;
  }

  // Use fully populated timetable if available
  const displayTimetable =
    fullTimetable || timetable;

  // ==========================================
  // Export PDF
  // ==========================================

  const handleExportPDF = async () => {
    try {
      const input =
        document.getElementById("timetable-pdf");

      if (!input) {
        alert("Timetable content not found.");
        return;
      }

      const originalHeight =
        input.style.height;

      const originalMaxHeight =
        input.style.maxHeight;

      const originalOverflow =
        input.style.overflow;

      input.style.height = "auto";
      input.style.maxHeight = "none";
      input.style.overflow = "visible";

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
      });

      input.style.height = originalHeight;
      input.style.maxHeight = originalMaxHeight;
      input.style.overflow = originalOverflow;

      const imgData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 10;

      const usableWidth =
        pageWidth - margin * 2;

      const imageWidth = usableWidth;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);

      pdf.text(
        "CampusSync ERP",
        margin,
        9
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      pdf.text(
        `${displayTimetable.department} | Semester ${displayTimetable.semester} | Division ${displayTimetable.division} | ${displayTimetable.academicYear}`,
        margin,
        15
      );

      const contentTop = 20;

      const firstPageHeight =
        pageHeight -
        contentTop -
        margin;

      if (imageHeight <= firstPageHeight) {
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          contentTop,
          imageWidth,
          imageHeight
        );
      } else {
        // First page
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          contentTop,
          imageWidth,
          imageHeight
        );

        let remainingHeight =
          imageHeight - firstPageHeight;

        let offset =
          firstPageHeight;

        while (remainingHeight > 0) {
          pdf.addPage();

          pdf.addImage(
            imgData,
            "PNG",
            margin,
            contentTop - offset,
            imageWidth,
            imageHeight
          );

          remainingHeight -=
            pageHeight - margin * 2;

          offset +=
            pageHeight - margin * 2;
        }
      }

      pdf.save(
        `${displayTimetable.department}_Semester_${displayTimetable.semester}_Division_${displayTimetable.division}.pdf`
      );
    } catch (error) {
      console.error(
        "PDF export error:",
        error
      );

      alert(
        "Unable to export timetable PDF."
      );
    }
  };

  // ==========================================
  // Print
  // ==========================================

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="drawer-overlay">

      <div className="view-drawer">

        {/* Header */}

        <div className="drawer-header">

          <div>
            <h2>
              Weekly Timetable
            </h2>

            <p>
              View generated timetable
            </p>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}

        <div
          id="timetable-pdf"
          className="drawer-content timetable-export-area"
        >

          {loading ? (
            <div className="loading-text">
              Loading timetable...
            </div>
          ) : (
            <>
              {/* Information */}

              <div className="timetable-info">

                <div>
                  <span>
                    Department
                  </span>

                  <h4>
                    {displayTimetable.department}
                  </h4>
                </div>

                <div>
                  <span>
                    Semester
                  </span>

                  <h4>
                    Semester{" "}
                    {displayTimetable.semester}
                  </h4>
                </div>

                <div>
                  <span>
                    Division
                  </span>

                  <h4>
                    {displayTimetable.division}
                  </h4>
                </div>

                <div>
                  <span>
                    Academic Year
                  </span>

                  <h4>
                    {displayTimetable.academicYear}
                  </h4>
                </div>

              </div>

              {/* Timetable */}

              <div className="complete-timetable-wrapper">

                <TimetableGrid
                  timetable={
                    displayTimetable
                  }
                />

              </div>
            </>
          )}

        </div>

        {/* Footer */}

        <div className="drawer-footer">

          <button
            className="secondary-btn"
            onClick={handlePrint}
            disabled={loading}
          >
            <Printer size={18} />
            Print
          </button>

          <button
            className="primary-btn"
            onClick={handleExportPDF}
            disabled={loading}
          >
            <Download size={18} />
            Export PDF
          </button>

          <button
            className="secondary-btn"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ViewTimetableDrawer;