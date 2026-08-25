# Dump Book Local File Locker Basis

The original Dump Book stored bytes in `localStorage`, so it could not safely accept 10 MB files. MDN documents Web Storage as limited to 10 MiB total per origin, split into 5 MiB each for `localStorage` and `sessionStorage`; writes beyond quota throw `QuotaExceededError`.[1]

The approved design therefore stores large file blobs in browser-local IndexedDB and leaves only metadata in the existing browser-local archive. IndexedDB is intended for significant structured client-side data, including files and blobs.[2] The file locker remains best-effort browser storage, so original files should still be included in a manual archive backup when they matter.

## References

[1] [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

[2] [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
