import request from '@/utils/request';

export function getCustomers(params) {
  return request({
    url: '/customers',
    method: 'get',
    params
  });
}

export function getCustomerById(id) {
  return request({
    url: `/customers/${id}`,
    method: 'get'
  });
}

export function addCustomer(data) {
  return request({
    url: '/customers',
    method: 'post',
    data
  });
}

export function updateCustomer(id, data) {
  return request({
    url: `/customers/${id}`,
    method: 'put',
    data
  });
}

export function deleteCustomer(id) {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  });
} 