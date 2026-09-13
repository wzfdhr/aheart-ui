# D4 full collector comparable viewport RED

- Candidate at failure: `82c564dc8fe9a06e1d169a5e13e04ea8a98f087c`.
- Approved baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.
- The second full attempt proved the compressed checkpoint repair: 264 checkpoints occupied about `725 MiB`, rather than the previous 3.0 GiB failure after 38 checkpoints.
- The run stopped before a release result when the next baseline Cascader measurement timed out at `page.waitForFunction`; browser/server cleanup counters were recorded and the temporary consumer was removed.
- Inspection of the completed Tree evidence exposed the invalid comparison: the nonvirtual Tree used its full content height as `clientHeight`, so its forty requested scroll steps retained zero effective offset. Each step also serialized every mounted full-DOM row, accumulating large in-memory case records.
- The failed run did not produce or claim performance, gzip, or release acceptance.

The accepted repair must apply the same bounded Tree viewport to full and virtual paths, persist a positive `maxScrollOffset`, bind every normalized offset to the actual pixel offset, store only the visible row geometry needed to recompute viewport coverage, and keep mounted-row counts separately. Contract mutations must reject zero-range or unbounded viewport evidence before another full run.
