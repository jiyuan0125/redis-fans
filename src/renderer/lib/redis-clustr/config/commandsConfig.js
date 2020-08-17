// Extra config for certain commands

export const mget = {
  group: function (resp) {
    return resp.map(function (r) {
      if (!r) return r;
      return r[0];
    });
  },
};
export const mset = {
  group: function () {
    return 'OK';
  },
};
export const del = {
  group: function (resp) {
    var total = 0;
    for (var i = 0; i < resp.length; i++) {
      total += resp[i] || 0;
    }
    return total;
  },
};
