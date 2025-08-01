class TimerService {
  constructor() {
    this.timers = new Map();
    this.callbacks = new Map();
  }

  // Start a countdown timer
  startTimer(id, duration, onTick, onComplete) {
    if (this.timers.has(id)) {
      this.stopTimer(id);
    }

    let remainingTime = duration;
    this.callbacks.set(id, { onTick, onComplete });

    const intervalId = setInterval(() => {
      remainingTime -= 1000;

      if (onTick) {
        onTick(remainingTime);
      }

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        this.timers.delete(id);
        this.callbacks.delete(id);
        
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    this.timers.set(id, { intervalId, startTime: Date.now(), duration, remainingTime });
  }

  // Stop a timer
  stopTimer(id) {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer.intervalId);
      this.timers.delete(id);
      this.callbacks.delete(id);
    }
  }

  // Pause a timer
  pauseTimer(id) {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer.intervalId);
      const elapsed = Date.now() - timer.startTime;
      timer.remainingTime = timer.duration - elapsed;
      this.timers.set(id, { ...timer, intervalId: null, isPaused: true });
    }
  }

  // Resume a paused timer
  resumeTimer(id) {
    const timer = this.timers.get(id);
    if (timer && timer.isPaused) {
      const callbacks = this.callbacks.get(id);
      if (callbacks) {
        this.startTimer(id, timer.remainingTime, callbacks.onTick, callbacks.onComplete);
      }
    }
  }

  // Get remaining time for a timer
  getRemainingTime(id) {
    const timer = this.timers.get(id);
    if (!timer) return 0;

    if (timer.isPaused) {
      return timer.remainingTime;
    }

    const elapsed = Date.now() - timer.startTime;
    return Math.max(0, timer.duration - elapsed);
  }

  // Check if timer is running
  isRunning(id) {
    return this.timers.has(id) && !this.timers.get(id)?.isPaused;
  }

  // Check if timer is paused
  isPaused(id) {
    return this.timers.has(id) && this.timers.get(id)?.isPaused;
  }

  // Get all active timers
  getActiveTimers() {
    return Array.from(this.timers.keys());
  }

  // Stop all timers
  stopAllTimers() {
    for (const id of this.timers.keys()) {
      this.stopTimer(id);
    }
  }

  // Format time in MM:SS format
  formatTime(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Format time in human readable format
  formatTimeHuman(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

export const timerService = new TimerService();
export default timerService;
