import request from '@/utils/request';

export function getDeliveries(params) {
  return request({
    url: '/deliveries',
    method: 'get',
    params
  });
}

export function getDeliveryById(id) {
  return request({
    url: `/deliveries/${id}`,
    method: 'get'
  });
}

export function addDelivery(data) {
  return request({
    url: '/deliveries',
    method: 'post',
    data
  });
}

export function updateDelivery(id, data) {
  return request({
    url: `/deliveries/${id}`,
    method: 'put',
    data
  });
}

export function deleteDelivery(id) {
  return request({
    url: `/deliveries/${id}`,
    method: 'delete'
  });
} 