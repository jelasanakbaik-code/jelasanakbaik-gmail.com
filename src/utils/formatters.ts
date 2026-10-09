export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (isoString?: string): string => {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};

export const getOrderStatusInfo = (status: string) => {
  switch (status) {
    case 'menunggu_pembayaran':
      return {
        label: 'Menunggu Pembayaran',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        badgeColor: 'bg-amber-500',
        step: 1,
      };
    case 'menunggu_approval':
      return {
        label: 'Menunggu Approval Bukti',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        badgeColor: 'bg-blue-500',
        step: 2,
      };
    case 'diproses':
      return {
        label: 'Sedang Diproses Dapur',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        badgeColor: 'bg-purple-500',
        step: 3,
      };
    case 'siap_diambil':
      return {
        label: 'Siap Diambil / Diantar',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        badgeColor: 'bg-indigo-500',
        step: 4,
      };
    case 'selesai':
      return {
        label: 'Selesai',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        badgeColor: 'bg-emerald-500',
        step: 5,
      };
    case 'dibatalkan':
      return {
        label: 'Dibatalkan',
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        badgeColor: 'bg-rose-500',
        step: 0,
      };
    default:
      return {
        label: status,
        color: 'bg-slate-100 text-slate-800 border-slate-200',
        badgeColor: 'bg-slate-400',
        step: 1,
      };
  }
};

export const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Terverifikasi (Lunas)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'pending_approval':
      return { label: 'Menunggu Verifikasi', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'rejected':
      return { label: 'Ditolak', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    case 'unpaid':
    default:
      return { label: 'Belum Bayar', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  }
};

export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'qris':
      return 'QRIS (Gopay / OVO / Dana / ShopeePay / BCA)';
    case 'transfer_bca':
      return 'Transfer Bank BCA';
    case 'transfer_mandiri':
      return 'Transfer Bank Mandiri';
    case 'tunai':
      return 'Tunai di Kasir';
    default:
      return method;
  }
};
