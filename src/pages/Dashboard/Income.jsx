import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { DashboardLayout } from "../../component/layouts/DashboardLayout";
import IncomeOverview from "../../component/Income/IncomeOverview";
import { Modal } from "../../component/Modal";
import { AddIncomeForm } from "../../component/Income/AddIncomeForm";
import { IncomeList } from "../../component/Income/IncomeList";
import { DeleteAlert } from "../../component/DeleteAlert";
import { useUserAuth } from "../../hook/useUserAuth";
import { toast } from "react-hot-toast";

export const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);
      console.log("GET_ALL_INCOME response:", response?.data);

      // safe assignment: handle array or wrapper shapes
      if (Array.isArray(response?.data)) {
        setIncomeData(response.data);
      } else if (Array.isArray(response?.data?.transactions)) {
        setIncomeData(response.data.transactions);
      } else if (Array.isArray(response?.data?.data)) {
        setIncomeData(response.data.data);
      } else {
        // fallback: empty and warn
        setIncomeData([]);
        console.warn("Unexpected GET_ALL_INCOME shape:", response?.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
      toast.error("Failed to load income details");
    } finally {
      setLoading(false);
    }
  };

  // handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // Validation Checks
    if (!source || !source.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error.response?.data?.message || error.message);
      toast.error("Failed to add income");
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error.response?.data?.message || error.message);
      toast.error("Failed to delete income");
    }
  };

  // handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />
          </div>

          <IncomeList
            transactions={incomeData || []}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({ show: false, data: null })} title="Delete Income">
          <DeleteAlert content="Are you sure you want to delete this income detail?" onDelete={() => deleteIncome(openDeleteAlert.data)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
