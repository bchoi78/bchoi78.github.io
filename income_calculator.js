let OVERTIME_MULTIPLIER = 1.5;
let SDI_MULTIPLIER = 0.01;
let FICA_MULTIPLIER = 0.0765;
// Hardcoding thresholds since we use income brackets here
let SIT_THRESHOLDS = [320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 540, 580, 620, 660, 700, 
                      740, 780, 820, 860, 900, 940, 980, 1020, 1060, 1100];
let SIT_DEDUCTIONS = [1.68, 1.9, 2.12, 2.34, 2.56, 2.78, 3.0, 3.22, 3.53, 3.97, 4.63, 5.51, 6.39,
                      7.27, 8.15, 9.03, 9.91, 10.79, 11.67, 12.55, 14.31, 16.07, 17.83, 19.59, 
                      21.35];
let FIT_THRESHOLDS = [260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400,
                      410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 520, 540, 560, 580, 600,
                      620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880, 900,
                      920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100]
let FIT_DEDUCTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23,
                      24, 26, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 
                      78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117];


function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calculateSIT(gross) {
    for (let i = 0; i < SIT_THRESHOLDS.length; i++) {
        if (gross < SIT_THRESHOLDS[i]) {
            return SIT_DEDUCTIONS[i];
        }
    }
    return null;
}

function calculateFIT(gross) {
    for (let i = 0; i < FIT_THRESHOLDS.length; i++) {
        if (gross < FIT_THRESHOLDS[i]) {
            return FIT_DEDUCTIONS[i];
        }
    }
    return null;
}

function calculateTaxes(payRate, regHrs, overtimeHrs) {
    let gross = payRate * (regHrs + (overtimeHrs * OVERTIME_MULTIPLIER));
    let fica = round(FICA_MULTIPLIER * gross, 2);
    let sdi = round(SDI_MULTIPLIER * gross, 2);
    let sit = calculateSIT(gross);
    let fit = calculateFIT(gross);
    let subtax = fica + sdi + sit + fit;
    sit = sit === null ? 'Error: value too large' : sit;
    fit = fit === null ? 'Error: value too large' : fit;
    let net = gross - subtax;

    return {
        'gross': gross,
        'fica': fica,
        'sdi': sdi,
        'sit': sit,
        'fit': fit,
        'subtax': subtax,
        'net': net
    }
}

function getInputVal(inputName) {
    return parseFloat($('input[name=' + inputName + ']').val(), 10);
}

$(document).ready(function() {
    $('#payroll-form').submit(function() {
        let payRate = getInputVal('payrate');
        let regHrs = getInputVal('nhours') + (getInputVal('nmins') / 60);
        let overHrs = getInputVal('ohours') + (getInputVal('omins') / 60);
        values = calculateTaxes(payRate, regHrs, overHrs);
        
        $('input[name=gross]').val(values['gross']);
        $('input[name=fica]').val(values['fica']);
        $('input[name=sdi]').val(values['sdi']);
        $('input[name=sit]').val(values['sit']);
        $('input[name=fit]').val(values['fit']);
        $('input[name=subtax]').val(values['subtax']);
        $('input[name=net]').val(values['net']);

        // Prevent reloading the page
        return false;
    })
});
