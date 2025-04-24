import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  RefreshCcw,
  Eye,
  EyeOff,
  Download,
  FileText,
  Calendar,
  CreditCard,
  Wallet,
} from "lucide-react";

// Mock data for financial accounts
const initialAccounts = [
  {
    id: 1,
    accountName: "Main Business Account",
    accountNumber: "********4567",
    bankName: "Commercial Bank",
    accountType: "Checking",
    routingNumber: "021000021",
    isDefault: true,
    lastUpdated: "2025-03-15",
  },
  {
    id: 2,
    accountName: "Savings Account",
    accountNumber: "********7890",
    bankName: "Bank of Ceylon",
    accountType: "Savings",
    routingNumber: "031202084",
    isDefault: false,
    lastUpdated: "2025-02-20",
  },
  {
    id: 3,
    accountName: "Business Credit Card",
    accountNumber: "********2352",
    bankName: "People's Bank",
    accountType: "Credit Card",
    routingNumber: "N/A",
    isDefault: false,
    lastUpdated: "2025-04-01",
  },
];

export default function RestaurantPaymentInfo() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAccount, setEditingAccount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("bankAccounts");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // New account form state
  const [newAccount, setNewAccount] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    accountType: "Checking",
    routingNumber: "",
    isDefault: false,
  });

  // Filtered accounts based on search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle editing form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAccount({
      ...editingAccount,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add new account
  const handleAddAccount = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...accounts.map(account => account.id)) + 1;
      
      // If new account is default, update other accounts
      let updatedAccounts = [...accounts];
      if (newAccount.isDefault) {
        updatedAccounts = updatedAccounts.map(account => ({
          ...account,
          isDefault: false
        }));
      }
      
      // Add new account
      const accountToAdd = {
        ...newAccount,
        id: newId,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setAccounts([...updatedAccounts, accountToAdd]);
      setNewAccount({
        accountName: "",
        accountNumber: "",
        bankName: "",
        accountType: "Checking",
        routingNumber: "",
        isDefault: false,
      });
      setShowAddForm(false);
      setIsLoading(false);
      
      showNotification("Account added successfully", "success");
    }, 800);
  };

  // Delete account
  const handleDeleteAccount = (id) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const updatedAccounts = accounts.filter(account => account.id !== id);
        setAccounts(updatedAccounts);
        setIsLoading(false);
        
        showNotification("Account deleted successfully", "success");
      }, 600);
    }
  };

  // Start editing account
  const handleEditStart = (account) => {
    setEditingAccount({ ...account });
  };

  // Save edited account
  const handleSaveEdit = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // If edited account is default, update other accounts
      let updatedAccounts = [...accounts];
      if (editingAccount.isDefault) {
        updatedAccounts = updatedAccounts.map(account => ({
          ...account,
          isDefault: account.id === editingAccount.id ? true : false
        }));
      } else {
        updatedAccounts = updatedAccounts.map(account =>
          account.id === editingAccount.id ? 
          { ...editingAccount, lastUpdated: new Date().toISOString().split('T')[0] } : 
          account
        );
      }
      
      setAccounts(updatedAccounts);
      setEditingAccount(null);
      setIsLoading(false);
      
      showNotification("Account updated successfully", "success");
    }, 800);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#03081F] text-white font-sans">
      {/* Header */}
      <header className="bg-[#03081F] border-b border-[#83858E]/20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Financial Account Management</h1>
          <p className="text-[#83858E] mt-1">
            Manage your restaurant's payment methods and financial accounts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${
            notification.type === "success" ? "bg-green-500/20 border border-green-500/50" :
            notification.type === "error" ? "bg-red-500/20 border border-red-500/50" :
            "bg-blue-500/20 border border-blue-500/50"
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className={
                notification.type === "success" ? "text-green-400" :
                notification.type === "error" ? "text-red-400" :
                "text-blue-400"
              } />
              <span>{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-[#83858E] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-[#83858E]/20">
          <div className="flex gap-1">
            <button
              className={`px-4 py-3 font-medium relative ${
                selectedTab === "bankAccounts"
                  ? "text-[#FC8A06]"
                  : "text-[#83858E] hover:text-white"
              }`}
              onClick={() => setSelectedTab("bankAccounts")}
            >
              Bank Accounts
              {selectedTab === "bankAccounts" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FC8A06]"></span>
              )}
            </button>
            <button
              className={`px-4 py-3 font-medium relative ${
                selectedTab === "paymentHistory"
                  ? "text-[#FC8A06]"
                  : "text-[#83858E] hover:text-white"
              }`}
              onClick={() => setSelectedTab("paymentHistory")}
            >
              Payment History
              {selectedTab === "paymentHistory" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FC8A06]"></span>
              )}
            </button>
            <button
              className={`px-4 py-3 font-medium relative ${
                selectedTab === "taxInformation"
                  ? "text-[#FC8A06]"
                  : "text-[#83858E] hover:text-white"
              }`}
              onClick={() => setSelectedTab("taxInformation")}
            >
              Tax Information
              {selectedTab === "taxInformation" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FC8A06]"></span>
              )}
            </button>
          </div>
        </div>

        {selectedTab === "bankAccounts" && (
          <>
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#83858E]"
                />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#FFFFFF10] rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all placeholder-[#83858E]"
                />
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-[#FC8A06] text-white px-4 py-2 rounded-lg hover:bg-[#FC8A06]/90 transition-colors shadow-md shadow-[#FC8A06]/20 w-full sm:w-auto justify-center"
              >
                {showAddForm ? (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Add New Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Add New Account Form */}
            {showAddForm && (
              <div className="bg-[#FFFFFF10] rounded-lg p-6 mb-6 border border-[#83858E]/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bank size={20} className="text-[#FC8A06]" />
                  Add New Financial Account
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#83858E] mb-1">
                      Account Name*
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={newAccount.accountName}
                      onChange={handleChange}
                      className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all"
                      placeholder="e.g. Main Business Account"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#83858E] mb-1">
                      Bank Name*
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={newAccount.bankName}
                      onChange={handleChange}
                      className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all"
                      placeholder="e.g. Commercial Bank"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#83858E] mb-1">
                      Account Number*
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="accountNumber"
                        value={newAccount.accountNumber}
                        onChange={handleChange}
                        className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all"
                        placeholder="Enter account number"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#83858E] hover:text-white"
                      >
                        {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#83858E] mb-1">
                      Account Type*
                    </label>
                    <select
                      name="accountType"
                      value={newAccount.accountType}
                      onChange={handleChange}
                      className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all appearance-none"
                      required
                    >
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Digital Wallet">Digital Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#83858E] mb-1">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      name="routingNumber"
                      value={newAccount.routingNumber}
                      onChange={handleChange}
                      className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all"
                      placeholder="Optional for some account types"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={newAccount.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#FC8A06]"
                    />
                    <label htmlFor="isDefault" className="ml-2 text-sm">
                      Set as default payment account
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-[#FFFFFF15] rounded-lg hover:bg-[#FFFFFF20] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAccount}
                    disabled={!newAccount.accountName || !newAccount.accountNumber || !newAccount.bankName}
                    className="flex items-center gap-2 bg-[#FC8A06] text-white px-6 py-2 rounded-lg hover:bg-[#FC8A06]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FC8A06]/20"
                  >
                    {isLoading ? (
                      <RefreshCcw size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    <span>Save Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Accounts Table */}
            <div className="bg-[#FFFFFF08] rounded-lg border border-[#83858E]/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FFFFFF10]">
                      <th className="text-left p-4 font-medium text-sm uppercase text-[#83858E]">Account Info</th>
                      <th className="text-left p-4 font-medium text-sm uppercase text-[#83858E]">Bank Name</th>
                      <th className="text-left p-4 font-medium text-sm uppercase text-[#83858E]">Type</th>
                      <th className="text-left p-4 font-medium text-sm uppercase text-[#83858E]">Last Updated</th>
                      <th className="text-left p-4 font-medium text-sm uppercase text-[#83858E]">Status</th>
                      <th className="text-right p-4 font-medium text-sm uppercase text-[#83858E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-[#83858E]">
                          No accounts found. Add a new account to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((account) => (
                        <tr 
                          key={account.id} 
                          className="border-t border-[#83858E]/10 hover:bg-[#FFFFFF05]"
                        >
                          {editingAccount && editingAccount.id === account.id ? (
                            // Edit mode
                            <>
                              <td className="p-4">
                                <input
                                  type="text"
                                  name="accountName"
                                  value={editingAccount.accountName}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] text-sm transition-all"
                                />
                                <div className="mt-2 relative">
                                  <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="accountNumber"
                                    value={editingAccount.accountNumber}
                                    onChange={handleEditChange}
                                    className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] text-sm transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#83858E] hover:text-white"
                                  >
                                    {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4">
                                <input
                                  type="text"
                                  name="bankName"
                                  value={editingAccount.bankName}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] text-sm transition-all"
                                />
                              </td>
                              <td className="p-4">
                                <select
                                  name="accountType"
                                  value={editingAccount.accountType}
                                  onChange={handleEditChange}
                                  className="w-full bg-[#FFFFFF15] border border-[#83858E]/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] text-sm transition-all"
                                >
                                  <option value="Checking">Checking</option>
                                  <option value="Savings">Savings</option>
                                  <option value="Credit Card">Credit Card</option>
                                  <option value="Digital Wallet">Digital Wallet</option>
                                </select>
                              </td>
                              <td className="p-4 text-sm text-[#83858E]">
                                {account.lastUpdated}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`isDefault-${account.id}`}
                                    name="isDefault"
                                    checked={editingAccount.isDefault}
                                    onChange={handleEditChange}
                                    className="w-4 h-4 accent-[#FC8A06]"
                                  />
                                  <label htmlFor={`isDefault-${account.id}`} className="ml-2 text-sm">
                                    Default
                                  </label>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 transition-colors"
                                    title="Save"
                                  >
                                    <Save size={16} />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 bg-[#FFFFFF10] hover:bg-[#FFFFFF20] rounded text-white transition-colors"
                                    title="Cancel"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            // View mode
                            <>
                              <td className="p-4">
                                <div className="font-medium">{account.accountName}</div>
                                <div className="text-sm text-[#83858E] flex items-center gap-1">
                                  <CreditCard size={14} className="text-[#FC8A06]" />
                                  {account.accountNumber}
                                </div>
                              </td>
                              <td className="p-4">{account.bankName}</td>
                              <td className="p-4">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FFFFFF10]">
                                  {account.accountType}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-[#83858E]">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {account.lastUpdated}
                                </div>
                              </td>
                              <td className="p-4">
                                {account.isDefault ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FC8A06]/20 text-[#FC8A06]">
                                    Default
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FFFFFF08] text-[#83858E]">
                                    Secondary
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEditStart(account)}
                                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredAccounts.length > 0 && (
              <div className="mt-4 text-sm text-[#83858E]">
                Showing {filteredAccounts.length} of {accounts.length} accounts
              </div>
            )}
          </>
        )}

        {selectedTab === "paymentHistory" && (
          <div className="bg-[#FFFFFF10] rounded-lg p-8 text-center border border-[#83858E]/20">
            <FileText size={48} className="mx-auto text-[#83858E] mb-4" />
            <h3 className="text-xl font-medium mb-2">Payment History</h3>
            <p className="text-[#83858E] mb-4">
              View your payment history, transactions, and statements here.
            </p>
            <button className="bg-[#FC8A06] text-white px-4 py-2 rounded-lg hover:bg-[#FC8A06]/90 transition-colors">
              View Payment History
            </button>
          </div>
        )}

        {selectedTab === "taxInformation" && (
          <div className="bg-[#FFFFFF10] rounded-lg p-8 text-center border border-[#83858E]/20">
            <FileText size={48} className="mx-auto text-[#83858E] mb-4" />
            <h3 className="text-xl font-medium mb-2">Tax Information</h3>
            <p className="text-[#83858E] mb-4">
              Manage your tax documents and payment information here.
            </p>
            <button className="bg-[#FC8A06] text-white px-4 py-2 rounded-lg hover:bg-[#FC8A06]/90 transition-colors">
              Manage Tax Information
            </button>
          </div>
        )}
      </main>

      {/* Footer with help information */}
      <footer className="border-t border-[#83858E]/20 py-6 px-6 bg-[#03081F]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#83858E]">
              Need help managing your accounts? <span className="text-[#FC8A06] cursor-pointer hover:underline">Contact Support</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-white hover:text-[#FC8A06] transition-colors">
                <Download size={16} />
                <span>Export Data</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-white hover:text-[#FC8A06] transition-colors">
                <FileText size={16} />
                <span>View Documentation</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}