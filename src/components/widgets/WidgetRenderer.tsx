import React from 'react';
import { WidgetInstance } from '../../types/widget';
import { TacticalMapWidget } from './TacticalMapWidget';
import { RssIntelWireWidget } from './RssIntelWireWidget';
import { LiveCamMatrixWidget } from './LiveCamMatrixWidget';
import { ThreatMatrixWidget } from './ThreatMatrixWidget';
import { CyberIncidentsWidget } from './CyberIncidentsWidget';
import { SeismicSensorWidget } from './SeismicSensorWidget';
import { SatCommTrackerWidget } from './SatCommTrackerWidget';
import { MarketCommoditiesWidget } from './MarketCommoditiesWidget';
import { RadioScannerWidget } from './RadioScannerWidget';
import { SystemTelemetryWidget } from './SystemTelemetryWidget';
import { IntelNotesWidget } from './IntelNotesWidget';
import { WeatherRadarWidget } from './WeatherRadarWidget';

interface WidgetRendererProps {
  instance: WidgetInstance;
  index: number;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ instance, index }) => {
  switch (instance.widgetTypeId) {
    case 'tactical_map':
      return <TacticalMapWidget instance={instance} index={index} />;
    case 'rss_intel_wire':
      return <RssIntelWireWidget instance={instance} index={index} />;
    case 'live_cam_matrix':
      return <LiveCamMatrixWidget instance={instance} index={index} />;
    case 'threat_matrix':
      return <ThreatMatrixWidget instance={instance} index={index} />;
    case 'cyber_incidents':
      return <CyberIncidentsWidget instance={instance} index={index} />;
    case 'seismic_sensor':
      return <SeismicSensorWidget instance={instance} index={index} />;
    case 'sat_comm_tracker':
      return <SatCommTrackerWidget instance={instance} index={index} />;
    case 'market_commodities':
      return <MarketCommoditiesWidget instance={instance} index={index} />;
    case 'radio_scanner':
      return <RadioScannerWidget instance={instance} index={index} />;
    case 'system_telemetry':
      return <SystemTelemetryWidget instance={instance} index={index} />;
    case 'intel_notes':
      return <IntelNotesWidget instance={instance} index={index} />;
    case 'weather_radar':
      return <WeatherRadarWidget instance={instance} index={index} />;
    default:
      return (
        <div className="p-4 border border-rose-500 bg-black text-rose-400 font-mono text-xs">
          UNKNOWN WIDGET TYPE: {instance.widgetTypeId}
        </div>
      );
  }
};
