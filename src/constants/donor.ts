import type { DurationObjectUnits } from "luxon";
import type { HealthConditionEntities, BloodTestResultsEntities } from "types/donor";

const DONOR = {
	NAMES: {
		MIN_LENGTH: 3
	},
	SURNAMES: {
		MIN_LENGTH: 3
	},
	CI: {
		MIN_LENGTH: 6,
		MAX_LENGTH: 9,
		TYPES: [ "V", "E", "J", "P", "G" ]
	},
	AGE: {
		RANGE: [ 18, 60 ]
	},
	WEIGHT: {
		MIN: 50
	},
	PHONE: {
	    LENGTH: 11
	},
	DIR: {
	    MIN_LENGTH: 5,
		MAX_LENGTH: 80
	},
	GENRE: [ 'Hombre', 'Mujer' ],
	BLOOD_TYPES: [ "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" ],
	HEALTH_CONDITIONS: {
		RANGE: [ 1, 26 ],
		entities: {
			'1': {
				type: 1,
				label: 'Fiebre o infección',
				level: 2,
				time: {
					value: 2,
					unit: 'weeks'
				}
			},
			'2': {
				type: 2,
				label: 'Cirugía menor',
				level: 1,
				time: {
					value: 4,
					unit: 'weeks'
				}
			},
			'3': {
				type: 3,
				label: 'Cirugía mayor',
				level: 1,
				time: {
					value: 6,
					unit: 'months'
				}
			},
			'4': {
				type: 4,
				label: 'Recibida transfusión de sangre',
				level: 1,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'5': {
				type: 5,
				label: 'Tatuaje',
				level: 1,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'6': {
				type: 6,
				label: 'Piercing',
				level: 1,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'7': {
				type: 7,
				label: 'Acupuntura',
				level: 1,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'8': {
				type: 8,
				label: 'Viaje a zonas endémicas',
				level: 1,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'9': {
				type: 9,
				label: 'Embarazo',
				level: 3,
				dueToOpts: {
					'1': {
						id: 1,
						value: 'Parto'
					},
					'2': {
						id: 2,
						value: 'Aborto'
					}
				},
				time: {
					value: 6,
					unit: 'months'
				}
			},
			'11': {
				type: 11,
				label: 'Lactancia',
				level: 2,
			},
			'12': {
				type: 12,
				label: 'Antibióticos',
				level: 2,
				time: {
					value: 7,
					unit: 'days'
				}
			},
			'13': {
				type: 13,
				label: 'Isotretinoína',
				level: 2,
				time: {
					value: 7,
					unit: 'days'
				}
			},
			'14': {
				type: 14,
				label: 'Contacto de riesgo con sífilis, gonorrea o clamidia',
				level: 2,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'15': {
				type: 15,
				label: 'Diagnóstico reciente de sífilis, gonorrea o clamidia',
				level: 2,
				time: {
					value: 12,
					unit: 'months'
				}
			},
			'16': {
				type: 16,
				label: 'Diabetes insulinodependiente',
				level: 4,
			},
			'17': {
				type: 17,
				label: 'Enfermedades cardíacas graves',
				level: 4,
			},
			'18': {
				type: 18,
				label: 'Enfermedades autoinmunes',
				level: 4,
			},
			'19': {
				type: 19,
				label: 'Cáncer',
				level: 4,
			},
			'20': {
				type: 20,
				label: 'VIH/SIDA',
				level: 4,
			},
			'21': {
				type: 21,
				label: 'Hepatitis B o C',
				level: 4,
			},
			'22': {
				type: 22,
				label: 'Enfermedad de Chagas',
				level: 4,
			},
			'23': {
				type: 23,
				label: 'Sífilis no tratada o crónica',
				level: 4,
			},
			'24': {
				type: 24,
				label: 'Hubo consumo de drogas intravenosas',
				level: 4,
			},
			'25': {
				type: 25,
				label: 'Hemofilia o trastornos de la coagulación',
				level: 4,
			},
			'26': {
				type: 26,
				label: 'Recibió un trasplante de órganos o tejidos',
				level: 4,
			}
		} as HealthConditionEntities
	},
	BLOOD_TEST_RESULTS: {
		RANGE: [ 1, 20 ],
		entities: {
			'1': {
				type: 1,
				label: 'Estable'
			},
			'2': {
				type: 2,
				label: 'Hemoglobina baja'
			},
			'3': {
				type: 3,
				label: 'Hematocrito bajos'
			},
			'4': {
				type: 4,
				label: 'VIH'
			},
			'5': {
				type: 5,
				label: 'Hepatitis B'
			},
			'6': {
				type: 6,
				label: 'Hepatitis C'
			},
			'7': {
				type: 7,
				label: 'Sífilis'
			},
			'8': {
				type: 8,
				label: 'Enfermedad de Chagas'
			},
			'9': {
				type: 9,
				label: 'Zika'
			},
			'10': {
				type: 10,
				label: 'Leucocitos elevados'
			},
			'11': {
				type: 11,
				label: 'Leucocitos disminuidos'
			},
			'12': {
				type: 12,
				label: 'Plaquetas fuera de rango'
			},
			'13': {
				type: 13,
				label: 'Glucosa elevada'
			},
			'14': {
				type: 14,
				label: 'Colesterol muy altos'
			},
			'15': {
				type: 15,
				label: 'Triglicéridos muy altos'
			},
			'16': {
				type: 16,
				label: 'Enzimas hepáticas elevadas'
			},
			'17': {
				type: 17,
				label: 'Tiempo de coagulación prolongado'
			},
			'18': {
				type: 18,
				label: 'Malaria'
			},
			'19': {
				type: 19,
				label: 'Proteínas anormales'
			},
			'20': {
				type: 20,
				label: 'Anticuerpos irregulares'
			}
		} as BloodTestResultsEntities
	},
	DONATIONS: {
		time: {
			value: 3,
			unit: 'months' as keyof DurationObjectUnits
		}
	}
};

export default DONOR;