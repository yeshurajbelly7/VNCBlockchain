'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, Clock, XCircle, Eye, Check, X, Search,
  Download, FileText, User, Mail, Phone, Calendar,
  AlertCircle, RefreshCw, Image as ImageIcon
} from 'lucide-react';

interface KYCDocuments {
  idType: string;
  idNumber: string;
  idFront: string;
  idBack: string | null;
  selfie: string;
  addressProof: string;
}

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface KYCSubmission {
  id: string;
  userId: number;
  userName: string;
  email: string;
  phone: string;
  status: string;
  submittedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  documents: KYCDocuments;
  personalInfo: PersonalInfo;
}

export default function KYCManagementPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKYC, setSelectedKYC] = useState<KYCSubmission | null>(null);

  // Mock KYC submissions data
  const kycSubmissions = [
    {
      id: 'KYC_001',
      userId: 1,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      status: 'pending',
      submittedDate: '2026-01-13 10:30:00',
      documents: {
        idType: 'Aadhaar Card',
        idNumber: '1234-5678-9012',
        idFront: '/uploads/kyc/aadhaar-front.jpg',
        idBack: '/uploads/kyc/aadhaar-back.jpg',
        selfie: '/uploads/kyc/selfie.jpg',
        addressProof: '/uploads/kyc/address-proof.pdf'
      },
      personalInfo: {
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        address: '123 Main Street, Mumbai, Maharashtra, India',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    },
    {
      id: 'KYC_002',
      userId: 2,
      userName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      status: 'pending',
      submittedDate: '2026-01-13 09:15:00',
      documents: {
        idType: 'PAN Card',
        idNumber: 'ABCDE1234F',
        idFront: '/uploads/kyc/pan-front.jpg',
        idBack: null,
        selfie: '/uploads/kyc/selfie2.jpg',
        addressProof: '/uploads/kyc/address-proof2.pdf'
      },
      personalInfo: {
        fullName: 'Jane Smith',
        dateOfBirth: '1992-08-22',
        address: '456 Park Avenue, Delhi, India',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    {
      id: 'KYC_003',
      userId: 3,
      userName: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+91 9876543212',
      status: 'approved',
      submittedDate: '2026-01-12 14:20:00',
      approvedDate: '2026-01-12 16:45:00',
      approvedBy: 'Admin',
      documents: {
        idType: 'Passport',
        idNumber: 'P1234567',
        idFront: '/uploads/kyc/passport-front.jpg',
        idBack: '/uploads/kyc/passport-back.jpg',
        selfie: '/uploads/kyc/selfie3.jpg',
        addressProof: '/uploads/kyc/address-proof3.pdf'
      },
      personalInfo: {
        fullName: 'Mike Wilson',
        dateOfBirth: '1988-12-10',
        address: '789 Lake Road, Bangalore, Karnataka, India',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    {
      id: 'KYC_004',
      userId: 4,
      userName: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+91 9876543213',
      status: 'rejected',
      submittedDate: '2026-01-11 11:30:00',
      rejectedDate: '2026-01-11 15:20:00',
      rejectedBy: 'Admin',
      rejectionReason: 'Document image quality too low. Please upload clear images.',
      documents: {
        idType: 'Driving License',
        idNumber: 'DL1234567890',
        idFront: '/uploads/kyc/dl-front.jpg',
        idBack: '/uploads/kyc/dl-back.jpg',
        selfie: '/uploads/kyc/selfie4.jpg',
        addressProof: '/uploads/kyc/address-proof4.pdf'
      },
      personalInfo: {
        fullName: 'Sarah Johnson',
        dateOfBirth: '1995-03-18',
        address: '321 Beach Road, Chennai, Tamil Nadu, India',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India'
      }
    }
  ];

  const stats = {
    pending: 234,
    approved: 8456,
    rejected: 45,
    totalSubmissions: 8735
  };

  const handleApprove = (kycId: string) => {
    console.log('Approving KYC:', kycId);
    alert(`KYC ${kycId} approved! User will now have full access to the dashboard.`);
    // In production, this would call an API to update the KYC status
  };

  const handleReject = (kycId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      console.log('Rejecting KYC:', kycId, 'Reason:', reason);
      alert(`KYC ${kycId} rejected. User will be notified.`);
      // In production, this would call an API to update the KYC status
    }
  };

  const filteredSubmissions = kycSubmissions.filter(kyc => {
    const matchesStatus = filterStatus === 'all' || kyc.status === filterStatus;
    const matchesSearch = kyc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kyc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kyc.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
            KYC Management System
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Review and approve user KYC documents for full dashboard access</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold bg-yellow-500/20 px-2 py-1 rounded-full">
              URGENT
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-400">Pending Review</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">96.8%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.approved.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Approved</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">0.5%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.rejected}</div>
          <div className="text-sm text-gray-400">Rejected</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 text-xs font-semibold">TOTAL</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalSubmissions.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Submissions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-purple-500/20">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or KYC ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KYC Submissions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions.map((kyc) => (
          <div key={kyc.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-colors">
            <div className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {kyc.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{kyc.userName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        kyc.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : kyc.status === 'approved'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {kyc.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {kyc.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {kyc.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {kyc.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar className="w-3 h-3" />
                      Submitted: {kyc.submittedDate}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button 
                    onClick={() => setSelectedKYC(kyc)}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {kyc.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(kyc.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(kyc.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Document Preview */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">ID Type</div>
                    <div className="text-sm font-semibold text-white">{kyc.documents.idType}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">ID Number</div>
                    <div className="text-sm font-semibold text-white">{kyc.documents.idNumber}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Location</div>
                    <div className="text-sm font-semibold text-white">{kyc.personalInfo.city}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Documents</div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1">
                      <ImageIcon className="w-4 h-4 text-green-400" />
                      4 Files
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KYC Detail Modal */}
      {selectedKYC && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">KYC Details - {selectedKYC.id}</h2>
              <button 
                onClick={() => setSelectedKYC(null)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Full Name</div>
                    <div className="text-white font-semibold">{selectedKYC.personalInfo.fullName}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Date of Birth</div>
                    <div className="text-white font-semibold">{selectedKYC.personalInfo.dateOfBirth}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 md:col-span-2">
                    <div className="text-sm text-gray-400 mb-1">Address</div>
                    <div className="text-white font-semibold">{selectedKYC.personalInfo.address}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <div className="text-white font-semibold">{selectedKYC.email}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <div className="text-white font-semibold">{selectedKYC.phone}</div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">ID Proof Front</div>
                    <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center border border-gray-700">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{selectedKYC.documents.idType}</div>
                  </div>
                  {selectedKYC.documents.idBack && (
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-2">ID Proof Back</div>
                      <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center border border-gray-700">
                        <ImageIcon className="w-12 h-12 text-gray-600" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{selectedKYC.documents.idType}</div>
                    </div>
                  )}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Selfie with ID</div>
                    <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center border border-gray-700">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Selfie Verification</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Address Proof</div>
                    <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center border border-gray-700">
                      <FileText className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">PDF Document</div>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedKYC.status === 'rejected' && selectedKYC.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-red-400 font-semibold mb-1">Rejection Reason</div>
                      <div className="text-gray-300 text-sm">{selectedKYC.rejectionReason}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        Rejected on: {selectedKYC.rejectedDate} by {selectedKYC.rejectedBy}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedKYC.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
                  <button 
                    onClick={() => {
                      handleApprove(selectedKYC.id);
                      setSelectedKYC(null);
                    }}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Approve KYC
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedKYC.id);
                      setSelectedKYC(null);
                    }}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Reject KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">KYC Approval Process</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>â€¢ Users must complete KYC verification to access full dashboard features</li>
              <li>â€¢ Approved users get access to trading, wallet, and all platform features</li>
              <li>â€¢ Rejected submissions allow users to resubmit with corrections</li>
              <li>â€¢ All documents are encrypted and stored securely</li>
              <li>â€¢ Average approval time: 24-48 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
