#!/usr/bin/env python3

import requests
import sys
import json
import base64
import io
from datetime import datetime
from pathlib import Path

class BizupyAPITester:
    def __init__(self, base_url="https://gstbilltracker.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)
        
        if files:
            # Remove Content-Type for file uploads
            test_headers.pop('Content-Type', None)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, data=data, headers=test_headers, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test send OTP
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.run_test(
            "Send OTP",
            "POST",
            "auth/send-otp",
            200,
            data={"email": test_email}
        )
        
        if not success:
            return False
        
        # Extract OTP from response (mocked implementation)
        otp = response.get('otp')
        if not otp:
            self.log_test("Extract OTP from response", False, "OTP not found in response")
            return False
        
        print(f"📱 OTP received: {otp}")
        
        # Test verify OTP
        success, response = self.run_test(
            "Verify OTP and Login",
            "POST",
            "auth/verify-otp",
            200,
            data={"email": test_email, "otp": otp}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response['user']
            print(f"🎉 Login successful for user: {self.user_data['email']}")
            
            # Test get current user
            success, user_response = self.run_test(
                "Get Current User",
                "GET",
                "auth/me",
                200
            )
            return success
        
        return False

    def test_dashboard_stats(self):
        """Test dashboard stats API"""
        print("\n📊 Testing Dashboard Stats...")
        
        success, response = self.run_test(
            "Get Dashboard Stats",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            required_fields = ['total_bills', 'total_customers', 'total_sales', 'total_gst']
            for field in required_fields:
                if field not in response:
                    self.log_test(f"Dashboard stats contains {field}", False, f"Missing field: {field}")
                    return False
                else:
                    self.log_test(f"Dashboard stats contains {field}", True)
        
        return success

    def create_sample_image(self):
        """Create a simple test image for bill upload"""
        try:
            from PIL import Image, ImageDraw, ImageFont
            
            # Create a simple invoice-like image
            img = Image.new('RGB', (800, 600), color='white')
            draw = ImageDraw.Draw(img)
            
            # Add some text to simulate an invoice
            draw.text((50, 50), "INVOICE", fill='black')
            draw.text((50, 100), "Invoice No: INV-001", fill='black')
            draw.text((50, 130), "Date: 2025-01-01", fill='black')
            draw.text((50, 160), "Seller: Test Company", fill='black')
            draw.text((50, 190), "GSTIN: 12ABCDE1234F1Z5", fill='black')
            draw.text((50, 250), "Item: Test Product", fill='black')
            draw.text((50, 280), "Quantity: 10", fill='black')
            draw.text((50, 310), "Rate: 100.00", fill='black')
            draw.text((50, 340), "Amount: 1000.00", fill='black')
            draw.text((50, 400), "CGST: 90.00", fill='black')
            draw.text((50, 430), "SGST: 90.00", fill='black')
            draw.text((50, 460), "Total: 1180.00", fill='black')
            
            # Save to bytes
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG', quality=85)
            img_bytes.seek(0)
            
            return img_bytes.getvalue()
        except ImportError:
            # Fallback: create a minimal valid JPEG
            # This is a minimal valid JPEG header + data
            jpeg_data = base64.b64decode(
                '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A'
            )
            return jpeg_data

    def test_bill_upload(self):
        """Test bill upload and OCR processing"""
        print("\n📄 Testing Bill Upload...")
        
        # Create test image
        image_data = self.create_sample_image()
        
        # Test bill upload
        files = {'file': ('test_invoice.jpg', image_data, 'image/jpeg')}
        
        success, response = self.run_test(
            "Upload Bill with OCR",
            "POST",
            "bills/upload",
            200,
            files=files
        )
        
        if success:
            bill_id = response.get('id')
            if bill_id:
                # Test get single bill
                success, bill_response = self.run_test(
                    "Get Single Bill",
                    "GET",
                    f"bills/{bill_id}",
                    200
                )
                
                if success:
                    # Test get all bills
                    success, bills_response = self.run_test(
                        "Get All Bills",
                        "GET",
                        "bills",
                        200
                    )
                    
                    return success and bill_id
        
        return False

    def test_customer_crud(self):
        """Test customer CRUD operations"""
        print("\n👥 Testing Customer CRUD...")
        
        # Create customer
        customer_data = {
            "name": "Test Customer",
            "gstin": "12ABCDE1234F1Z5",
            "email": "customer@test.com",
            "phone": "9876543210",
            "address": "Test Address"
        }
        
        success, response = self.run_test(
            "Create Customer",
            "POST",
            "customers",
            200,
            data=customer_data
        )
        
        if success:
            customer_id = response.get('id')
            
            # Get all customers
            success, customers_response = self.run_test(
                "Get All Customers",
                "GET",
                "customers",
                200
            )
            
            if success and customer_id:
                # Update customer
                update_data = {"name": "Updated Customer Name"}
                success, update_response = self.run_test(
                    "Update Customer",
                    "PUT",
                    f"customers/{customer_id}",
                    200,
                    data=update_data
                )
                
                if success:
                    # Delete customer
                    success, delete_response = self.run_test(
                        "Delete Customer",
                        "DELETE",
                        f"customers/{customer_id}",
                        200
                    )
                    return success
        
        return False

    def test_product_crud(self):
        """Test product CRUD operations"""
        print("\n📦 Testing Product CRUD...")
        
        # Create product
        product_data = {
            "name": "Test Product",
            "hsn_code": "1234",
            "unit": "pcs",
            "default_price": 100.0
        }
        
        success, response = self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=product_data
        )
        
        if success:
            product_id = response.get('id')
            
            # Get all products
            success, products_response = self.run_test(
                "Get All Products",
                "GET",
                "products",
                200
            )
            
            if success and product_id:
                # Update product
                update_data = {"name": "Updated Product Name", "default_price": 150.0}
                success, update_response = self.run_test(
                    "Update Product",
                    "PUT",
                    f"products/{product_id}",
                    200,
                    data=update_data
                )
                
                if success:
                    # Delete product
                    success, delete_response = self.run_test(
                        "Delete Product",
                        "DELETE",
                        f"products/{product_id}",
                        200
                    )
                    return success
        
        return False

    def test_invoice_creation(self):
        """Test invoice creation with conditional GSTIN logic"""
        print("\n🧾 Testing Invoice Creation...")
        
        # Test invoice with quantity <= 500 (no GSTIN required)
        invoice_data_small = {
            "customer_name": "Small Order Customer",
            "customer_address": "Test Address",
            "items": [
                {
                    "product_name": "Test Product",
                    "quantity": 10,
                    "rate": 100.0,
                    "amount": 1000.0
                }
            ],
            "notes": "Test invoice with small quantity"
        }
        
        success, response = self.run_test(
            "Create Invoice (Small Quantity)",
            "POST",
            "invoices",
            200,
            data=invoice_data_small
        )
        
        if success:
            # Test invoice with quantity > 500 (GSTIN required)
            invoice_data_large = {
                "customer_name": "Large Order Customer",
                "customer_gstin": "12ABCDE1234F1Z5",
                "customer_address": "Test Address",
                "items": [
                    {
                        "product_name": "Bulk Product",
                        "quantity": 600,
                        "rate": 50.0,
                        "amount": 30000.0
                    }
                ],
                "notes": "Test invoice with large quantity"
            }
            
            success, response = self.run_test(
                "Create Invoice (Large Quantity with GSTIN)",
                "POST",
                "invoices",
                200,
                data=invoice_data_large
            )
            
            if success:
                # Get all invoices
                success, invoices_response = self.run_test(
                    "Get All Invoices",
                    "GET",
                    "invoices",
                    200
                )
                return success
        
        return False

    def test_ledger_and_export(self):
        """Test ledger API and Excel export"""
        print("\n📋 Testing Ledger and Export...")
        
        # Get ledger entries
        success, response = self.run_test(
            "Get Ledger Entries",
            "GET",
            "ledger",
            200
        )
        
        if success:
            # Test Excel export
            try:
                url = f"{self.api_url}/ledger/export?format=xlsx"
                headers = {'Authorization': f'Bearer {self.token}'}
                response = requests.get(url, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    self.log_test("Export Ledger to Excel", True)
                    return True
                else:
                    self.log_test("Export Ledger to Excel", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Export Ledger to Excel", False, f"Error: {str(e)}")
        
        return False

    def test_profile_update(self):
        """Test profile update functionality"""
        print("\n⚙️ Testing Profile Update...")
        
        profile_data = {
            "name": "Updated Test User",
            "phone": "9876543210",
            "language_preference": "hi",
            "business_name": "Test Business",
            "business_gstin": "12ABCDE1234F1Z5",
            "business_address": "Test Business Address",
            "business_phone": "9876543211"
        }
        
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            "auth/profile",
            200,
            data=profile_data
        )
        
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Bizupy Backend API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Test authentication first
        if not self.test_authentication_flow():
            print("❌ Authentication failed - stopping tests")
            return False
        
        # Run all other tests
        test_methods = [
            self.test_dashboard_stats,
            self.test_bill_upload,
            self.test_customer_crud,
            self.test_product_crud,
            self.test_invoice_creation,
            self.test_ledger_and_export,
            self.test_profile_update
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                print(f"❌ Test {test_method.__name__} failed with exception: {str(e)}")
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = BizupyAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())