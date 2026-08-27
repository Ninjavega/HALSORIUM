import { WidgetDefinition, LayoutPreset } from '../types/widget';

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    id: 'tactical_map',
    type: 'tactical_map',
    title: 'GEOSPATIAL SITUATION MATRIX',
    subtitle: 'Global projection / OSINT hotspots / SAT pass',
    iconName: 'Globe',
    category: 'geospatial',
    defaultSize: { w: 8, h: 460 },
    minSize: { w: 4, h: 320 },
    tags: ['MAP', 'OSINT', 'GLOBAL', 'GPS', 'SATELLITE'],
    capabilities: {
      refreshable: true,
      filterable: true,
      audioFeedback: true,
      expandable: true,
      tabs: ['LIVE_PROJECTION', 'HOTSPOTS', 'CHOKEPOINTS', 'SAT_PASS'],
    },
    dataCoupler: {
      couplerId: 'coupler-geo-v1',
      targetProtocol: 'WebSocket',
      eventSubscriptions: ['GEO_FILTER_CHANGE', 'DEFCON_LEVEL_CHANGED', 'PING_COORDINATES'],
      eventEmissions: ['GEO_TARGET_LOCKED', 'ZONE_ALERT_CLICKED'],
      pollIntervalMs: 5000,
      samplePayloadSchema: {
        timestamp: '2026-08-26T20:55:00Z',
        projection: 'equirectangular',
        activeHotspotsCount: 14,
        hotspots: [
          { id: 'hs-1', name: 'Strait of Hormuz', lat: 26.56, lng: 56.25, threat: 'HIGH', category: 'maritime' },
          { id: 'hs-2', name: 'Taiwan Strait', lat: 24.2, lng: 119.5, threat: 'ELEVATED', category: 'geopolitical' },
          { id: 'hs-3', name: 'Red Sea Corridor', lat: 15.0, lng: 42.0, threat: 'CRITICAL', category: 'trade_disruption' },
          { id: 'hs-4', name: 'Suwalki Gap', lat: 54.3, lng: 23.3, threat: 'MODERATE', category: 'nato_flank' }
        ]
      },
      notes: 'Ready for integration with MapLibre, Cesium, Leaflet, or OpenLayers geospatial backends.',
    },
    description: 'High-tech tactical world map displaying strategic straits, real-time simulated telemetry hotspots, satellite flybys, radar sweep and coordinate crosshairs.',
  },
  {
    id: 'rss_intel_wire',
    type: 'rss_intel_wire',
    title: 'GLOBAL INTEL WIRE & OSINT FEED',
    subtitle: 'Aggregated news / breaking alerts / dispatches',
    iconName: 'Radio',
    category: 'intel',
    defaultSize: { w: 4, h: 460 },
    minSize: { w: 3, h: 300 },
    tags: ['RSS', 'OSINT', 'NEWS', 'DISPATCHES', 'ALERTS'],
    capabilities: {
      refreshable: true,
      filterable: true,
      audioFeedback: true,
      tabs: ['ALL_DISPATCHES', 'GEOPOLITICS', 'CYBER_THREATS', 'DEFENSE', 'RAW_COUPLER'],
    },
    dataCoupler: {
      couplerId: 'coupler-rss-wire-v1',
      targetProtocol: 'RSS/Atom',
      eventSubscriptions: ['DISPATCH_FILTER_CHANGE', 'REFRESH_ALL_FEEDS'],
      eventEmissions: ['BREAKING_NEWS_TRIGGERED', 'DISPATCH_SELECTED'],
      pollIntervalMs: 15000,
      samplePayloadSchema: {
        feedUrl: 'https://api.worldmonitor.prototype/rss/aggregator',
        lastPoll: '2026-08-26T20:54:12Z',
        items: [
          {
            id: 'intel-904',
            title: 'Global Maritime Defense Task Force reports GPS jamming over Baltic Sea',
            source: 'Reuters / OSINT Maritime',
            category: 'DEFENSE',
            urgency: 'HIGH',
            timestamp: '3m ago',
            summary: 'Multiple commercial vessels report anomalous signal disruption near Gotland.'
          }
        ]
      },
      notes: 'Coupler stub prepared for RSS feed aggregator, NewsAPI, Mastodon, or Telegram OSINT channels.',
    },
    description: 'Real-time multi-channel intelligence wire with severity badges, source filtering, search, breaking dispatch simulator, and raw RSS coupling inspector.',
  },
  {
    id: 'threat_matrix',
    type: 'threat_matrix',
    title: 'DEFCON & THREAT POSTURE MATRIX',
    subtitle: 'Strategic alert levels / geopolitical escalation',
    iconName: 'ShieldAlert',
    category: 'operations',
    defaultSize: { w: 4, h: 340 },
    minSize: { w: 3, h: 260 },
    tags: ['DEFCON', 'THREAT', 'MILITARY', 'ALERTS', 'SECURITY'],
    capabilities: {
      refreshable: true,
      audioFeedback: true,
      tabs: ['POSTURE_STATUS', 'SECTORS', 'READINESS', 'EVENT_TRIGGER'],
    },
    dataCoupler: {
      couplerId: 'coupler-threat-defcon-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['DEFCON_OVERRIDE_REQUEST'],
      eventEmissions: ['DEFCON_LEVEL_CHANGED', 'SECTOR_ALERT_ESCALATED'],
      samplePayloadSchema: {
        defconCurrent: 3,
        cyberThreatIndex: 78.4,
        nuclearReadiness: 'ROUND_THE_CLOCK',
        sectors: {
          indoPacific: 'ELEVATED',
          easternEurope: 'CRITICAL',
          middleEast: 'SEVERE',
          spaceDomain: 'NOMINAL',
          cyberDomain: 'HIGH_ALERT'
        }
      },
      notes: 'Plugs into central command API, security operations center (SOC), or state monitoring engines.',
    },
    description: 'Interactive DEFCON indicator with sector alert breakdowns, readiness status meters, and live threat dispatch triggers.',
  },
  {
    id: 'live_cam_matrix',
    type: 'live_cam_matrix',
    title: 'TACTICAL SURVEILLANCE & CAM MATRIX',
    subtitle: 'CCTV grid / Earth orbit / Strategic ports',
    iconName: 'Video',
    category: 'surveillance',
    defaultSize: { w: 4, h: 340 },
    minSize: { w: 3, h: 260 },
    tags: ['VIDEO', 'CCTV', 'STREAMS', 'PORTS', 'ORBIT'],
    capabilities: {
      refreshable: true,
      audioFeedback: true,
      tabs: ['MATRIX_VIEW', 'SINGLE_FEED', 'TELEMETRY', 'STREAM_CONFIG'],
    },
    dataCoupler: {
      couplerId: 'coupler-rtsp-cam-v1',
      targetProtocol: 'RTSP/WebRTC',
      eventSubscriptions: ['CAM_CHANNEL_SWITCH', 'TRIGGER_SNAPSHOT'],
      eventEmissions: ['CAM_OFFLINE_ALERT', 'MOTION_DETECTED'],
      samplePayloadSchema: {
        channels: [
          { id: 'CAM-01', location: 'Bosporus Strait - North Cam', status: 'ACTIVE', fps: 30, resolution: '1080p', codec: 'H.264' },
          { id: 'CAM-02', location: 'ISS Live Earth Observation', status: 'ACTIVE', fps: 60, resolution: '4K', codec: 'HEVC' },
          { id: 'CAM-03', location: 'Panama Canal Locks Cam 4', status: 'OFFLINE_SIGNAL', fps: 0, resolution: '720p', codec: 'RTSP' },
          { id: 'CAM-04', location: 'Tokyo Bay Maritime Radar', status: 'ACTIVE', fps: 24, resolution: '1080p', codec: 'H.264' }
        ]
      },
      notes: 'UX layer equipped with scanline shaders, camera switching, PTZ simulation, and WebRTC / HLS video player wrappers.',
    },
    description: 'Surveillance stream matrix with multi-camera selector, CRT scanline overlay, telemetry readout, offline test pattern generator, and PTZ controls.',
  },
  {
    id: 'cyber_incidents',
    type: 'cyber_incidents',
    title: 'CYBER WARFARE & THREAT TELEMETRY',
    subtitle: 'SOC radar / DDoS vectors / Zero-day CVEs',
    iconName: 'Terminal',
    category: 'cyber',
    defaultSize: { w: 4, h: 340 },
    minSize: { w: 3, h: 260 },
    tags: ['CYBER', 'SOC', 'DDOS', 'CVE', 'SECURITY'],
    capabilities: {
      refreshable: true,
      filterable: true,
      tabs: ['LIVE_VECTORS', 'CVE_ALERTS', 'HEX_STREAM', 'PORT_MONITOR'],
    },
    dataCoupler: {
      couplerId: 'coupler-cyber-soc-v1',
      targetProtocol: 'WebSocket',
      eventSubscriptions: ['CYBER_SCAN_TRIGGER'],
      eventEmissions: ['CYBER_INCIDENT_DETECTED', 'CVE_TRIGGERED'],
      samplePayloadSchema: {
        activeAttacksPerSec: 1420,
        topVectors: ['NTP_AMPLIFICATION', 'BGP_HIJACK', 'SQLI_PROBE', 'BOTNET_SWARM'],
        recentIncidents: [
          { id: 'cve-2026-9921', target: 'Critical Infrastructure SCADA', severity: 'CRITICAL', status: 'MITIGATING' }
        ]
      },
      notes: 'Coupler prepared for Suricata, Zeek, Graylog, Splunk, or Shodan feeds.',
    },
    description: 'Live cyber incident stream featuring attack vector distribution, CVE bulletins, live hex packet inspector, and active defense metrics.',
  },
  {
    id: 'seismic_sensor',
    type: 'seismic_sensor',
    title: 'SEISMIC & GEOLOGICAL SENSOR NET',
    subtitle: 'USGS Richter telemetry / Tsunami alerts',
    iconName: 'Activity',
    category: 'telemetry',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['SEISMIC', 'EARTHQUAKE', 'USGS', 'SENSORS', 'GEOLOGY'],
    capabilities: {
      refreshable: true,
      tabs: ['SEISMOGRAM', 'RECENT_QUAKES', 'TECTONIC_MAP', 'SETTINGS'],
    },
    dataCoupler: {
      couplerId: 'coupler-usgs-seismic-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['REFRESH_SEISMIC_DATA'],
      eventEmissions: ['SEISMIC_ALERT_TRIGGERED'],
      pollIntervalMs: 30000,
      samplePayloadSchema: {
        lastQuake: {
          magnitude: 6.4,
          place: 'Off coast of Honshu, Japan',
          depthKm: 32.4,
          tsunamiWarning: false,
          time: '12m ago'
        }
      },
      notes: 'Coupler designed for USGS GeoJSON Earthquake feed and EMSC seismic APIs.',
    },
    description: 'Real-time seismic wave visualization, Richter magnitude logs, epicenter triangulation, and tectonic alert monitors.',
  },
  {
    id: 'sat_comm_tracker',
    type: 'sat_comm_tracker',
    title: 'SATELLITE CONSTELLATION TRACKER',
    subtitle: 'NORAD TLE passes / Starlink / Recon birds',
    iconName: 'Orbit',
    category: 'geospatial',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['SPACE', 'SATELLITE', 'TLE', 'ORBIT', 'NORAD'],
    capabilities: {
      refreshable: true,
      tabs: ['RADAR_SCOPE', 'ORBITAL_PASSES', 'TLE_DATA', 'FREQUENCY'],
    },
    dataCoupler: {
      couplerId: 'coupler-norad-sat-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['GEO_TARGET_LOCKED'],
      eventEmissions: ['SAT_OVERHEAD_ALERT'],
      samplePayloadSchema: {
        trackingCount: 3820,
        overheadSatellites: [
          { name: 'USA-326 (RECON)', noradId: 51445, altKm: 512, az: 142.4, el: 68.2, downlink: '2245.5 MHz' },
          { name: 'ISS (ZARYA)', noradId: 25544, altKm: 418, az: 284.1, el: 41.0, downlink: '145.80 MHz' }
        ]
      },
      notes: 'Plugs into Space-Track.org or CelesTrak TLE orbit propagation algorithms.',
    },
    description: 'Orbital pass azimuth/elevation scope, NORAD satellite catalog browser, telemetry readout, and downlink frequency indicators.',
  },
  {
    id: 'market_commodities',
    type: 'market_commodities',
    title: 'COMMODITIES & STRATEGIC ASSETS',
    subtitle: 'Brent crude / Gold / Lithium / Semiconductor ETF',
    iconName: 'TrendingUp',
    category: 'finance',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['MARKET', 'OIL', 'GOLD', 'FINANCE', 'SUPPLY_CHAIN'],
    capabilities: {
      refreshable: true,
      tabs: ['STRATEGIC_ASSETS', 'SUPPLY_CHAINS', 'CURRENCIES', 'INDEX'],
    },
    dataCoupler: {
      couplerId: 'coupler-fin-commodities-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['MARKET_CURRENCY_SWITCH'],
      eventEmissions: ['COMMODITY_VOLATILITY_ALERT'],
      samplePayloadSchema: {
        brentCrude: { price: 84.12, change: '+2.4%', trend: 'UP' },
        goldOz: { price: 2840.50, change: '+0.8%', trend: 'UP' },
        semiconductorIndex: { value: 5410.2, change: '-1.1%', trend: 'DOWN' },
        uraniumLbs: { price: 92.30, change: '+3.1%', trend: 'UP' }
      },
      notes: 'Ready for AlphaVantage, Yahoo Finance, or Bloomberg data pipelines.',
    },
    description: 'Global financial and strategic supply chain ticker tracking energy, rare earths, defense equities, and currency risk.',
  },
  {
    id: 'radio_scanner',
    type: 'radio_scanner',
    title: 'TACTICAL RADIO & SPECTRUM SCANNER',
    subtitle: 'SDR waterfall / HF / VHF / Military comms',
    iconName: 'RadioReceiver',
    category: 'surveillance',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['RADIO', 'SDR', 'WATERFALL', 'AUDIO', 'SPECTRUM'],
    capabilities: {
      refreshable: true,
      audioFeedback: true,
      tabs: ['WATERFALL', 'PRESETS', 'INTERCEPT_LOG', 'DECODER'],
    },
    dataCoupler: {
      couplerId: 'coupler-sdr-audio-v1',
      targetProtocol: 'WebSocket',
      eventSubscriptions: ['TUNE_FREQUENCY_REQUEST'],
      eventEmissions: ['SIGNAL_INTERCEPTED'],
      samplePayloadSchema: {
        currentFrequencyMhz: 121.5,
        bandwidthKhz: 25,
        mode: 'AM_EMERGENCY',
        signalToNoiseDb: 28.4,
        activeTransmission: true
      },
      notes: 'Coupler designed for WebSDR, OpenWebRX, and KiwiSDR stream integration.',
    },
    description: 'Software-defined radio interface featuring an animated frequency waterfall spectrum, tuner dial, audio channel simulator, and signal decryptor.',
  },
  {
    id: 'system_telemetry',
    type: 'system_telemetry',
    title: 'PWA CLIENT & EVENT BUS TELEMETRY',
    subtitle: 'Buffer health / Event throughput / Edge ping',
    iconName: 'Cpu',
    category: 'telemetry',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['SYSTEM', 'PWA', 'TELEMETRY', 'EVENT_BUS', 'PERF'],
    capabilities: {
      refreshable: true,
      tabs: ['EVENT_METRICS', 'EDGE_PING', 'MEMORY_CACHE', 'STORAGE'],
    },
    dataCoupler: {
      couplerId: 'coupler-client-telemetry-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['*'],
      eventEmissions: ['SYSTEM_HEALTH_REPORT'],
      samplePayloadSchema: {
        fps: 60,
        eventQueueSize: 12,
        memoryUsageMb: 48.2,
        edgePingMs: 24,
        redisCacheSimulation: 'NOMINAL'
      },
      notes: 'Monitors client runtime performance, event bus message throughput, and local indexedDB/localStorage status.',
    },
    description: 'System health dashboard showing event-bus throughput, mock caching layer latency, frame rate, and storage status.',
  },
  {
    id: 'intel_notes',
    type: 'intel_notes',
    title: 'TACTICAL SITREP & INTEL SCRATCHPAD',
    subtitle: 'Timestamped field reports / cryptographic hashes',
    iconName: 'FileText',
    category: 'intel',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['SITREP', 'NOTES', 'ENCRYPTION', 'LOGS', 'SCRATCHPAD'],
    capabilities: {
      refreshable: true,
      tabs: ['ACTIVE_SITREP', 'ARCHIVED_LOGS', 'EXPORT_JSON'],
    },
    dataCoupler: {
      couplerId: 'coupler-notes-storage-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['DISPATCH_SELECTED', 'GEO_TARGET_LOCKED'],
      eventEmissions: ['SITREP_SAVED_LOCAL'],
      samplePayloadSchema: {
        sitrepsCount: 4,
        storageType: 'localStorage / IndexedDB'
      },
      notes: 'Local persistent field notebook with SHA checksum stamping and JSON export capabilities.',
    },
    description: 'Encrypted-style situation report scratchpad with automatic timestamping, quick intel tags, and persistence.',
  },
  {
    id: 'weather_radar',
    type: 'weather_radar',
    title: 'ATMOSPHERIC & EXTREME WEATHER RADAR',
    subtitle: 'Global cyclonic radar / Barometric telemetry',
    iconName: 'CloudRain',
    category: 'telemetry',
    defaultSize: { w: 4, h: 320 },
    minSize: { w: 3, h: 240 },
    tags: ['WEATHER', 'RADAR', 'TYPHOON', 'BAROMETER', 'STORM'],
    capabilities: {
      refreshable: true,
      tabs: ['CYCLONE_RADAR', 'PRESSURE_MAP', 'ALERTS_FEED'],
    },
    dataCoupler: {
      couplerId: 'coupler-noaa-weather-v1',
      targetProtocol: 'REST_JSON',
      eventSubscriptions: ['REFRESH_WEATHER'],
      eventEmissions: ['SEVERE_WEATHER_ALERT'],
      samplePayloadSchema: {
        activeStorms: [
          { name: 'Typhoon SHANSHAN', category: 4, windKts: 115, pressureHpa: 945, lat: 28.1, lng: 130.4 }
        ]
      },
      notes: 'Coupler prepared for NOAA, OpenWeatherMap, or Windy radar feeds.',
    },
    description: 'Atmospheric weather radar with storm tracking, barometric pressure indicators, and severe cyclonic alert tickers.',
  }
];

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'world_command',
    name: 'GLOBAL COMMAND HQ',
    badge: 'DEFAULT',
    description: 'Comprehensive situation room layout with Geospatial Map, Intel Wire, DEFCON Matrix, and Surveillance Cam Matrix.',
    widgets: [
      { widgetTypeId: 'tactical_map', colSpan: 8, height: 460 },
      { widgetTypeId: 'rss_intel_wire', colSpan: 4, height: 460 },
      { widgetTypeId: 'threat_matrix', colSpan: 4, height: 340 },
      { widgetTypeId: 'live_cam_matrix', colSpan: 4, height: 340 },
      { widgetTypeId: 'cyber_incidents', colSpan: 4, height: 340 },
    ],
  },
  {
    id: 'cyber_defense',
    name: 'CYBER DEFENSE & SOC',
    badge: 'TECH',
    description: 'Focused cyber warfare operations layout with Incident Stream, Telemetry, Radio Intercept, and Threat Posture.',
    widgets: [
      { widgetTypeId: 'cyber_incidents', colSpan: 6, height: 420 },
      { widgetTypeId: 'threat_matrix', colSpan: 6, height: 420 },
      { widgetTypeId: 'system_telemetry', colSpan: 4, height: 340 },
      { widgetTypeId: 'radio_scanner', colSpan: 4, height: 340 },
      { widgetTypeId: 'rss_intel_wire', colSpan: 4, height: 340 },
    ],
  },
  {
    id: 'geo_surveillance',
    name: 'GEO-INT & SURVEILLANCE',
    badge: 'OSINT',
    description: 'Geospatial and reconnaissance layout with Tactical Map, Live Cam Matrix, Satellite Tracker, and Weather Radar.',
    widgets: [
      { widgetTypeId: 'tactical_map', colSpan: 8, height: 480 },
      { widgetTypeId: 'live_cam_matrix', colSpan: 4, height: 480 },
      { widgetTypeId: 'sat_comm_tracker', colSpan: 4, height: 340 },
      { widgetTypeId: 'seismic_sensor', colSpan: 4, height: 340 },
      { widgetTypeId: 'weather_radar', colSpan: 4, height: 340 },
    ],
  },
  {
    id: 'economic_intel',
    name: 'GLOBAL MACRO & ASSETS',
    badge: 'MARKET',
    description: 'Economic security, critical supply chains, global news, and sitrep logging.',
    widgets: [
      { widgetTypeId: 'market_commodities', colSpan: 6, height: 380 },
      { widgetTypeId: 'rss_intel_wire', colSpan: 6, height: 380 },
      { widgetTypeId: 'tactical_map', colSpan: 8, height: 400 },
      { widgetTypeId: 'intel_notes', colSpan: 4, height: 400 },
    ],
  },
  {
    id: 'minimal_ops',
    name: 'MINIMAL OPS DASH',
    badge: 'LITE',
    description: 'Compact high-efficiency view with Map and Intel Wire.',
    widgets: [
      { widgetTypeId: 'tactical_map', colSpan: 7, height: 520 },
      { widgetTypeId: 'rss_intel_wire', colSpan: 5, height: 520 },
    ],
  },
];
