<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTrendsHistoryStore } from '~/stores/trendsHistory'
import GraphSelector from './GraphSelector.vue'

const trendsHistoryStore = useTrendsHistoryStore()

const selectedSeries = ref('average')

const seriesOptions = [
  { value: 'average', label: 'Average Position', color: '#28A6BD' },
  { value: 'top_3', label: 'Top 3%', color: '#28A6BD' },
  { value: 'market_share', label: 'Market Share', color: '#28A6BD' }
]

const chartData = computed(() => {
  const history = trendsHistoryStore.trendHistory?.history
  if (!history?.length) return []

  const seriesMap = {
    average: {
      name: 'Average Position',
      data: history.map(item => ({
        x: new Date(item.execution_date).getTime(),
        y: item.average,
        // Store additional data for tooltip
        originalData: item
      })),
      color: '#28A6BD'
    },
    top_3: {
      name: 'Top 3 Position',
      data: history.map(item => ({
        x: new Date(item.execution_date).getTime(),
        y: item.top_3_position,
        originalData: item
      })),
      color: '#28A6BD'
    },
    market_share: {
      name: 'Market Share Position',
      data: history.map(item => ({
        x: new Date(item.execution_date).getTime(),
        y: item.market_share_position,
        originalData: item
      })),
      color: '#28A6BD'
    }
  }

  return [seriesMap[selectedSeries.value as keyof typeof seriesMap]]
})

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: true
    },
    background: 'transparent',
    fontFamily: "Montserrat",
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#28A6BD']
  },
  fill: {
    type: 'solid',
    colors: ['#28A6BD'],
    opacity: 0.1
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM dd, yyyy",
        day: 'MMM dd, yyyy',
        hour: 'MMM dd, yyyy'
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: '#7D8EA0'
      }
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    labels: {
      formatter: (value: number) => Math.round(value).toString(),
      style: {
        fontSize: '13px',
        colors: '#2A3F54'
      }
    },
    reversed: false,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  grid: {
    show: true,
    borderColor: '#DDDDDD',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  },
  tooltip: {
    x: {
      format: 'MMM dd, yyyy'
    },
    theme: 'light',
    custom: function({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: number, dataPointIndex: number, w: any }) {
      const data = w.config.series[seriesIndex].data[dataPointIndex]
      const originalData = data.originalData
      
      let content = `
        <div style="padding: 8px; background: white; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
          <div style="font-weight: bold; margin-bottom: 4px;">
            ${new Date(data.x).toLocaleDateString('en-US', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
          <div>Average Position: ${originalData.average.toFixed(1)}</div>
          <div>Top 3 Position: ${originalData.top_3_position}</div>
          <div>Top 3 %: ${originalData.top_3_percentage.toFixed(1)}%</div>
          <div>Market Share Pos: ${originalData.market_share_position}</div>
          <div>Market Share %: ${originalData.market_share_percentage.toFixed(1)}%</div>
      `
      
      if (originalData.keywords && originalData.keywords.length > 0) {
        content += `
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee;">
            <div>Keywords: ${originalData.keywords.slice(0, 3).join(', ')}</div>
            ${originalData.keywords.length > 3 ? 
              `<div style="font-size: 11px; color: #666;">+${originalData.keywords.length - 3} more</div>` : 
              ''
            }
          </div>
        `
      }
      
      content += '</div>'
      return content
    }
  },
  legend: {
    show: false
  },
  colors: ['#28A6BD'],
  markers: {
    size: 8,
    strokeColors: '#ffffff',
    strokeWidth: 4,
    fillOpacity: 1,
    shape: 'circle',
    hover: {
      size: 8
    },
    discrete: []
  }
}))
</script>

<template>
  <ClientOnly>
    <div class="w-full bg-white">
      <!-- SVG Gradient Definition -->
      <svg width="0" height="0" style="position: absolute;">
        <defs>
          <linearGradient id="markerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#97C72F;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1CA2CC;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Graph Selector -->
      <GraphSelector 
        v-model="selectedSeries" 
        :options="seriesOptions" 
      />
      
      <!-- Chart Container -->
      <div class="h-[350px] w-full">
        <div v-if="trendsHistoryStore.loading" class="w-full h-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <div v-else class="w-full h-full">
          <apexchart
            width="100%"
            height="100%"
            type="area"
            :options="chartOptions"
            :series="chartData"
          />
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="w-full h-[400px] bg-white rounded-lg p-6 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
:deep(.apexcharts-marker) {
  fill: url(#markerGradient) !important;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5));
}

:deep(.apexcharts-svg) {
  overflow: visible;
}
</style>