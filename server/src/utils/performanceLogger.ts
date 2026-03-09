// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
};

interface TimingLog {
    category: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status: 'started' | 'completed' | 'failed';
}

class PerformanceLogger {
    private logs: Map<string, TimingLog> = new Map();
    private requestStartTime: number = 0;
    private requestId: string = '';

    /**
     * Start a new request timing session
     */
    startRequest(topic: string): string {
        this.requestId = `${topic}-${Date.now()}`;
        this.requestStartTime = Date.now();
        this.logs.clear();

        console.log(colors.cyan + '\n┌─────────────────────────────────────────────────┐' + colors.reset);
        console.log(colors.cyan + `│ 🚀 Request: ${topic.substring(0, 35).padEnd(35)} │` + colors.reset);
        console.log(colors.cyan + '└─────────────────────────────────────────────────┘' + colors.reset);

        return this.requestId;
    }

    /**
     * Start timing a specific category
     */
    start(category: string): void {
        const now = Date.now();
        this.logs.set(category, {
            category,
            startTime: now,
            status: 'started'
        });

        console.log(colors.gray + `⏱️  [${this.getElapsed()}ms] Starting: ${category}` + colors.reset);
    }

    /**
     * End timing for a category (success)
     */
    end(category: string): number {
        const log = this.logs.get(category);
        if (!log) {
            console.warn(colors.yellow + `⚠️  No start time found for: ${category}` + colors.reset);
            return 0;
        }

        const now = Date.now();
        const duration = now - log.startTime;

        log.endTime = now;
        log.duration = duration;
        log.status = 'completed';

        // Color code based on duration
        let durationColor = colors.green;
        if (duration > 5000) durationColor = colors.red;
        else if (duration > 2000) durationColor = colors.yellow;

        console.log(durationColor + `✓ [${this.getElapsed()}ms] Completed: ${category} (${duration}ms)` + colors.reset);

        return duration;
    }

    /**
     * Mark a category as failed
     */
    fail(category: string, error?: string): void {
        const log = this.logs.get(category);
        if (!log) return;

        const now = Date.now();
        const duration = now - log.startTime;

        log.endTime = now;
        log.duration = duration;
        log.status = 'failed';

        console.log(colors.red + `✗ [${this.getElapsed()}ms] Failed: ${category} (${duration}ms)` + colors.reset);
        if (error) {
            console.log(colors.red + `  └─ Error: ${error}` + colors.reset);
        }
    }

    /**
     * End the request and show summary
     */
    endRequest(): void {
        const totalDuration = Date.now() - this.requestStartTime;

        console.log(colors.cyan + '\n┌─────────────────────────────────────────────────┐' + colors.reset);
        console.log(colors.cyan + '│ 📊 Performance Summary                          │' + colors.reset);
        console.log(colors.cyan + '├─────────────────────────────────────────────────┤' + colors.reset);

        // Sort by duration (longest first)
        const sortedLogs = Array.from(this.logs.values())
            .filter(log => log.duration !== undefined)
            .sort((a, b) => (b.duration || 0) - (a.duration || 0));

        sortedLogs.forEach(log => {
            const statusIcon = log.status === 'completed' ? '✓' : '✗';
            const statusColor = log.status === 'completed' ? colors.green : colors.red;
            const percentage = ((log.duration! / totalDuration) * 100).toFixed(1);
            const bar = this.getProgressBar(log.duration!, totalDuration);

            console.log(
                colors.cyan + '│ ' + colors.reset +
                statusColor + `${statusIcon} ${log.category.padEnd(25)} ${log.duration!.toString().padStart(6)}ms ${percentage.padStart(5)}%` + colors.reset
            );
            console.log(colors.cyan + '│ ' + colors.reset + colors.gray + `  ${bar}` + colors.reset);
        });

        console.log(colors.cyan + '├─────────────────────────────────────────────────┤' + colors.reset);

        // Total time with color coding
        let totalColor = colors.green;
        if (totalDuration > 15000) totalColor = colors.red;
        else if (totalDuration > 10000) totalColor = colors.yellow;

        console.log(
            colors.cyan + '│ ' + colors.reset +
            totalColor + `🏁 Total Time: ${totalDuration}ms`.padEnd(48) + colors.reset +
            colors.cyan + '│' + colors.reset
        );
        console.log(colors.cyan + '└─────────────────────────────────────────────────┘\n' + colors.reset);
    }

    /**
     * Get elapsed time since request start
     */
    private getElapsed(): number {
        return Date.now() - this.requestStartTime;
    }

    /**
     * Generate a visual progress bar
     */
    private getProgressBar(duration: number, total: number, width: number = 30): string {
        const percentage = duration / total;
        const filled = Math.round(percentage * width);
        const empty = width - filled;

        return colors.blue + '█'.repeat(filled) + colors.reset + colors.gray + '░'.repeat(empty) + colors.reset;
    }

    /**
     * Get timing data for response metadata
     */
    getTimingData(): { [key: string]: number } {
        const data: { [key: string]: number } = {};

        this.logs.forEach((log, category) => {
            if (log.duration !== undefined) {
                // Convert category name to snake_case
                const key = category.toLowerCase().replace(/\s+/g, '_') + '_ms';
                data[key] = log.duration;
            }
        });

        data.total_ms = Date.now() - this.requestStartTime;

        return data;
    }
}

// Export a singleton instance
export const perfLogger = new PerformanceLogger();
