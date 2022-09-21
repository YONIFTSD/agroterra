<script>
import { Line } from "vue-chartjs";
import EventBus from '@/assets/js/EventBus';
export default {
  extends: Line,
  data() {
    return {
      gradient1: null,
      gradient2: null,
      gradient3: null,
      gradient4: null,
      gradient5: null,
      gradient6: null,
      gradient7: null,
    };
  },
  mounted() {
    EventBus.$on('DataChartSalePEN', (data) => {
        let me = this;
        let datasets = [];
        for (let index = 0; index < data.datasets_chart_pen.length; index++) {
          const element = data.datasets_chart_pen[index];
          datasets.push({
                    label: element.name,
                    backgroundColor: element.color,
                    data: element.data_chart
          })
        }

        
        this.renderChart(
            {
                labels: data.labels,
                datasets: datasets,
            },
            { responsive: true, maintainAspectRatio: false }
            );
    });
    this.gradient1 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient4 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient5 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient6 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient7 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient1.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient1.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient1.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient3.addColorStop(0, "rgba(0, 200, 255, 0.9)");
    this.gradient3.addColorStop(0.5, "rgba(0, 200, 255, 0.25)");
    this.gradient3.addColorStop(1, "rgba(0, 200, 255, 0)");

    this.gradient4.addColorStop(0, "rgba(0, 180, 255, 0.9)");
    this.gradient4.addColorStop(0.5, "rgba(0, 180, 255, 0.25)");
    this.gradient4.addColorStop(1, "rgba(0, 180, 255, 0)");

    this.gradient5.addColorStop(0, "rgba(0, 160, 255, 0.9)");
    this.gradient5.addColorStop(0.5, "rgba(0, 160, 255, 0.25)");
    this.gradient5.addColorStop(1, "rgba(0, 160, 255, 0)");

    this.gradient6.addColorStop(0, "rgba(0, 130, 255, 0.9)");
    this.gradient6.addColorStop(0.5, "rgba(0, 130, 255, 0.25)");
    this.gradient6.addColorStop(1, "rgba(0, 130, 255, 0)");

    this.gradient7.addColorStop(0, "rgba(0, 100, 255, 0.9)");
    this.gradient7.addColorStop(0.5, "rgba(0, 100, 255, 0.25)");
    this.gradient7.addColorStop(1, "rgba(0, 100, 255, 0)");

    this.renderChart(
      {
        labels: [],
        datasets: [
          // {
          //   label: "Soles",
          //   borderColor: "#FC2525",
          //   pointBackgroundColor: "white",
          //   borderWidth: 1,
          //   pointBorderColor: "white",
          //   backgroundColor: this.gradient1,
          //   data: []
          // },
          // {
          //   label: "Dólares",
          //   borderColor: "#05CBE1",
          //   pointBackgroundColor: "white",
          //   pointBorderColor: "white",
          //   borderWidth: 1,
          //   backgroundColor: this.gradient2,
          //   data: []
          // }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
