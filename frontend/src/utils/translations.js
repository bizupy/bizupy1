export const translations = {
  en: {
    // Landing Page
    heroTitle: "Smart GST Bill & Business Tracker",
    heroSubtitle: "Upload bills, track GST, create invoices - all in one place",
    getStarted: "Get Started Free",
    features: "Features",
    pricing: "Pricing",
    
    // Features
    feature1Title: "Bill Upload & OCR",
    feature1Desc: "Upload photos or PDFs and extract all GST data automatically",
    feature2Title: "Excel-like Ledger",
    feature2Desc: "Maintain digital records with easy export to Excel/CSV",
    feature3Title: "Professional Invoices",
    feature3Desc: "Create and share GST-compliant invoices instantly",
    feature4Title: "Reports & Analytics",
    feature4Desc: "Track sales, customers, and GST with visual reports",
    
    // Pricing
    freePlan: "Free",
    freePlanDesc: "Perfect to get started",
    proPlan: "Pro",
    proPlanDesc: "For growing businesses",
    businessPlan: "Business",
    businessPlanDesc: "For established businesses",
    perMonth: "/month",
    upgradeNow: "Upgrade Now",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    enterEmail: "Enter your email",
    sendOTP: "Send OTP",
    enterOTP: "Enter OTP",
    verify: "Verify & Login",
    
    // Dashboard
    dashboard: "Dashboard",
    totalBills: "Total Bills",
    totalCustomers: "Total Customers",
    totalSales: "Total Sales",
    totalGST: "Total GST",
    monthlySales: "Monthly Sales",
    monthlyGST: "Monthly GST",
    recentBills: "Recent Bills",
    uploadBill: "Upload Bill",
    createInvoice: "Create Invoice",
    viewLedger: "View Ledger",
    
    // Bills
    bills: "Bills",
    uploadNewBill: "Upload New Bill",
    dragDropText: "Drag & drop bill images or PDFs here, or click to browse",
    processing: "Processing...",
    confidence: "Confidence",
    editData: "Edit Data",
    delete: "Delete",
    
    // Ledger
    ledger: "Ledger",
    exportExcel: "Export Excel",
    exportCSV: "Export CSV",
    date: "Date",
    customer: "Customer",
    invoiceNo: "Invoice No",
    products: "Products",
    subtotal: "Subtotal",
    cgst: "CGST",
    sgst: "SGST",
    igst: "IGST",
    totalGSTLabel: "Total GST",
    totalAmount: "Total Amount",
    
    // Invoices
    invoices: "Invoices",
    newInvoice: "New Invoice",
    customerName: "Customer Name",
    customerGSTIN: "Customer GSTIN (Optional)",
    addItem: "Add Item",
    productName: "Product Name",
    quantity: "Quantity",
    rate: "Rate",
    amount: "Amount",
    save: "Save",
    cancel: "Cancel",
    download: "Download",
    share: "Share",
    
    // Customers
    customers: "Customers",
    addCustomer: "Add Customer",
    name: "Name",
    gstin: "GSTIN",
    phone: "Phone",
    address: "Address",
    
    // Products
    products: "Products",
    addProduct: "Add Product",
    hsnCode: "HSN Code",
    unit: "Unit",
    defaultPrice: "Default Price",
    
    // Settings
    settings: "Settings",
    profile: "Profile",
    businessInfo: "Business Information",
    language: "Language",
    subscription: "Subscription",
    currentPlan: "Current Plan",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    logout: "Logout",
  },
  hi: {
    // Landing Page
    heroTitle: "स्मार्ट GST बिल और व्यवसाय ट्रैकर",
    heroSubtitle: "बिल अपलोड करें, GST ट्रैक करें, इनवॉइस बनाएं - सब एक जगह",
    getStarted: "मुफ्त शुरू करें",
    features: "सुविधाएँ",
    pricing: "मूल्य निर्धारण",
    
    // Features
    feature1Title: "बिल अपलोड और OCR",
    feature1Desc: "फोटो या PDF अपलोड करें और सभी GST डेटा स्वचालित रूप से निकालें",
    feature2Title: "एक्सेल जैसा लेजर",
    feature2Desc: "एक्सेल/CSV में आसान एक्सपोर्ट के साथ डिजिटल रिकॉर्ड बनाए रखें",
    feature3Title: "पेशेवर इनवॉइस",
    feature3Desc: "तुरंत GST-अनुपालन इनवॉइस बनाएं और साझा करें",
    feature4Title: "रिपोर्ट और एनालिटिक्स",
    feature4Desc: "विज़ुअल रिपोर्ट के साथ बिक्री, ग्राहकों और GST को ट्रैक करें",
    
    // Pricing
    freePlan: "मुफ्त",
    freePlanDesc: "शुरुआत के लिए बिल्कुल सही",
    proPlan: "प्रो",
    proPlanDesc: "बढ़ते व्यवसायों के लिए",
    businessPlan: "व्यवसाय",
    businessPlanDesc: "स्थापित व्यवसायों के लिए",
    perMonth: "/महीना",
    upgradeNow: "अभी अपग्रेड करें",
    
    // Auth
    login: "लॉगिन",
    signup: "साइन अप",
    email: "ईमेल",
    enterEmail: "अपना ईमेल दर्ज करें",
    sendOTP: "OTP भेजें",
    enterOTP: "OTP दर्ज करें",
    verify: "सत्यापित करें और लॉगिन करें",
    
    // Dashboard
    dashboard: "डैशबोर्ड",
    totalBills: "कुल बिल",
    totalCustomers: "कुल ग्राहक",
    totalSales: "कुल बिक्री",
    totalGST: "कुल GST",
    monthlySales: "मासिक बिक्री",
    monthlyGST: "मासिक GST",
    recentBills: "हाल के बिल",
    uploadBill: "बिल अपलोड करें",
    createInvoice: "इनवॉइस बनाएं",
    viewLedger: "लेजर देखें",
    
    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    logout: "लॉगआउट",
  }
};

export const useTranslation = (language = 'en') => {
  return translations[language] || translations.en;
};