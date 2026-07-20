const PI:f64=3.14159265358979323846;

function modPositive(value:f64,modulus:f64):f64 {const result=value-Math.floor(value/modulus)*modulus;return result<0.0?result+modulus:result;}

export function solar_longitude(unixMs:f64):f64 {
  const julianDay=unixMs/86400000.0+2440587.5;
  const n=julianDay-2451545.0;
  const meanLongitude=modPositive(280.460+0.9856474*n,360.0);
  const anomaly=modPositive(357.528+0.9856003*n,360.0)*PI/180.0;
  return modPositive(meanLongitude+1.915*Math.sin(anomaly)+0.020*Math.sin(2.0*anomaly),360.0);
}

export function equation_of_time(dayOfYear:f64):f64 {
  const b=2.0*PI*(dayOfYear-81.0)/364.0;
  return 9.87*Math.sin(2.0*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
}

function modInt(value:i32,modulus:i32):i32 {const result=value%modulus;return result<0?result+modulus:result;}

export function sexagenary_day_index(year:i32,month:i32,dayValue:i32,hour:i32):i32 {
  const day=dayValue+(hour>=23?1:0),a=(14-month)/12,y=year+4800-a,m=month+12*a-3;
  const jdn=day+(153*m+2)/5+365*y+y/4-y/100+y/400-32045;
  return modInt(jdn+49,60);
}

export function abi_version():i32 {return 1;}
