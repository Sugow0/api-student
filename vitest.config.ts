import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "istanbul",
			reporter: ["text", "lcov", "html"],
			include: ["src/app/**"],
			exclude: ["src/tests/**"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 70,
			},
		},
	},
});
