export class Step {
  constructor(name, duration) {
      this.name = name;
      this.duration = duration;
      this.remaining = 0
      this.index = -1;
  }

  async execute(setStatus) {
      this.index ++
      this.remaining = this.duration;
      setStatus({name: this.name, duration: this.duration, index: this.index, remaining: this.remaining})
      const intervalId = setInterval(() => {
          if (this.remaining > 0) {
              this.remaining--;
          } else {
              clearInterval(intervalId);
          }
          setStatus(state => ({...state, remaining: this.remaining}))
      }, 1000);
      await new Promise(resolve => setTimeout(resolve, this.duration * 1000));
      setStatus(state => ({...state, name: this.name, duration: this.duration}))
  }
}

export class Workflow {
  constructor() {
      this.steps = [];
  }

  addStep(step) {
      this.steps.push(step);
  }

  async run(setStatus) {
      for (const step of this.steps) {
          await step.execute(setStatus);
      }
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

