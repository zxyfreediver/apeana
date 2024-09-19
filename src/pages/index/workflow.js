export class Step {
  constructor(name, duration) {
      this.name = name;
      this.duration = duration;
      this.remaining = 0;
      this.status = 'pending';
      this.intervalId = null;
  }

  async execute(setStatus) {
      this.remaining = this.duration;
      this.status = 'running';
      setStatus(state => ({...state, name: this.name, duration: this.duration, remaining: this.remaining, status: this.status}));

      const runStep = async () => {
        return new Promise(resolve => {
          this.intervalId = setInterval(() => {
              if (this.remaining > 0) {
                  this.remaining--;
              } else {
                  clearInterval(this.intervalId);
                  resolve();
              }
              setStatus(state => ({...state, remaining: this.remaining}));
          }, 1000);
        });
      };

      await runStep();
      // 等待一段时间, 动画
      await new Promise(resolve => setTimeout(() => resolve(), 300));
  }

  pause(setStatus) {
      if (this.status === 'running') {
          clearInterval(this.intervalId);
          this.status = 'paused';
          setStatus(state => ({...state, status: this.status}));
      }
  }

  resume(setStatus) {
      if (this.status === 'paused') {
          this.status = 'running';
          setStatus(state => ({...state, status: this.status}));

          this.intervalId = setInterval(() => {
              if (this.remaining > 0) {
                  this.remaining--;
              } else {
                  clearInterval(this.intervalId);
              }
              setStatus(state => ({...state, remaining: this.remaining}));
          }, 1000);
      }
  }

  stop(setStatus) {
      clearInterval(this.intervalId);
      this.remaining = 0;
      this.status = 'pending';
     setStatus(state => ({...state, remaining: this.remaining, status: this.status, index: -1}))
  }
}

export class Workflow {
  constructor(setStatus) {
      this.steps = [];
      this.setStatus = setStatus;
      this.currentStepIndex = 0;
  }

  addStep(step) {
      this.steps.push(step);
  }

  async run() {
      for (this.currentStepIndex = 0; this.currentStepIndex < this.steps.length; this.currentStepIndex++) {
          const step = this.steps[this.currentStepIndex];
          if (step.name === '闭气') {
            this.setStatus(state => ({...state, index: state.index + 1}))
          }
          await step.execute(this.setStatus);
          if (this.currentStepIndex === this.steps.length - 1) {
            this.setStatus(state => ({...state, index: -1, status: 'pending'}))
          }
      }
  }

  pause() {
      if (this.currentStepIndex < this.steps.length) {
          this.steps[this.currentStepIndex].pause(this.setStatus);
      }
  }

  resume() {
      if (this.currentStepIndex < this.steps.length) {
          this.steps[this.currentStepIndex].resume(this.setStatus);
      }
  }

  stop() {
      for (const step of this.steps) {
          step.stop(this.setStatus);
      }
      this.currentStepIndex = this.steps.length; // 停止后不再继续执行
  }
}

export class PreparationStep extends Step {
  constructor(duration) {
      super("准备时间", duration);
  }
}

export class TrainingStep extends Step {
  constructor(name, duration) {
      super(name, duration);
  }
}

