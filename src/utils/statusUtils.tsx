export const getStatusColor = (status: string) => {
    switch (status) {
        case 'accept':
            return 'bg-green-500';
        case 'refuse':
            return 'bg-red-500';
        case 'canceled':
            return 'bg-yellow-500';
        case 'completed':
            return 'bg-blue-500';
        case 'in-use':
            return 'bg-purple-500';
        case 'refunded':
            return 'bg-teal-500';
        default:
            return 'bg-gray-500';
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'accept':
            return 'Chuẩn bị phòng';
        case 'refuse':
            return 'Đã từ chối';
        case 'canceled':
            return 'Đã hủy';
        case 'completed':
            return 'Hoàn thành';
        case 'in-use':
            return 'Khách đã nhận phòng';
        case 'refunded':
            return 'Đã hoàn tiền';
        default:
            return 'Đang chờ xử lý';
    }
};
