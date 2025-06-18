import request from '@/utils/request';

export function getOrders(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  });
}

export function getOrderById(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  });
}

export function addOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  });
}

export function updateOrder(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  });
}

export function deleteOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'delete'
  });
} 