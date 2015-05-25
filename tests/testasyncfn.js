function pAsyncFn(n) {
	'use strict';
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			if (n === 10) {
				reject('operation failed');
			}
			resolve(n);
		}, 100);
		
		if (n === 30) {
			throw new Error('sync operation throws error');
		}
	});
}
