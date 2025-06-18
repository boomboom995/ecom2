import request from '@/utils/request';

export function getCoupons(params) {
  return request({
    url: '/coupons',
    method: 'get',
    params
  });
}

export function getCouponById(id) {
  return request({
    url: `/coupons/${id}`,
    method: 'get'
  });
}

export function addCoupon(data) {
  return request({
    url: '/coupons',
    method: 'post',
    data
  });
}

export function updateCoupon(id, data) {
  return request({
    url: `/coupons/${id}`,
    method: 'put',
    data
  });
}

export function deleteCoupon(id) {
  return request({
    url: `/coupons/${id}`,
    method: 'delete'
  });
} 