/**
 * Service de calcul de prise en charge assurance - VERSION SIMPLIFIÉE SANS PLAFONDS
 */

export const insuranceCalculatorService = {

  /**
   * Calcule la prise en charge d'assurance pour une consultation (SANS PLAFONDS)
   * @param {Object} patientInsurance - Données d'assurance du patient
   * @param {Number} consultationAmount - Montant de la consultation en FCFA
   * @returns {Object} Détail du calcul de prise en charge
   */
  calculateCoverage(patientInsurance, consultationAmount) {
    // Valeurs par défaut si pas d'assurance
    if (!patientInsurance?.hasInsurance || !patientInsurance?.isActive) {
      return {
        consultationAmount,
        insuranceCoverage: 0,
        patientPayment: consultationAmount,
        coverageRate: 0,
        canBeCovered: false,
        message: 'Aucune assurance active'
      };
    }

    // Vérification de la validité de l'assurance
    const today = new Date();
    const expirationDate = new Date(patientInsurance.validUntil);

    if (expirationDate < today) {
      return {
        consultationAmount,
        insuranceCoverage: 0,
        patientPayment: consultationAmount,
        coverageRate: 0,
        canBeCovered: false,
        error: 'Assurance expirée',
        message: `Assurance expirée le ${expirationDate.toLocaleDateString('fr-FR')}`
      };
    }

    // Calcul de base de la prise en charge (SANS VÉRIFICATION DE PLAFOND)
    let insuranceCoverage = consultationAmount * (patientInsurance.coverageRate / 100);

    // Application de la franchise si applicable (première consultation de l'année)
    const deductible = patientInsurance.deductible || 0;
    if (deductible > 0) {
      // Supposons qu'on vérifie si c'est la première consultation de l'année
      // (à implémenter selon la logique métier)
      const isFirstConsultationOfYear = true; // À remplacer par vraie logique

      if (isFirstConsultationOfYear) {
        insuranceCoverage = Math.max(0, insuranceCoverage - deductible);
      }
    }

    // Calcul du reste à charge patient
    const patientPayment = consultationAmount - insuranceCoverage;

    return {
      consultationAmount,
      insuranceCoverage,
      patientPayment,
      coverageRate: patientInsurance.coverageRate,
      canBeCovered: insuranceCoverage > 0,
      deductibleApplied: deductible > 0 ? deductible : 0,
      message: insuranceCoverage > 0 ?
        `Prise en charge: ${insuranceCoverage.toLocaleString()} FCFA (${patientInsurance.coverageRate}%)` :
        'Aucune prise en charge possible'
    };
  },

  /**
   * Valide les données d'assurance d'un patient (VERSION SIMPLIFIÉE)
   * @param {Object} insurance - Données d'assurance
   * @returns {Object} Résultat de validation avec erreurs éventuelles
   */
  validateInsurance(insurance) {
    const errors = {};

    if (!insurance?.hasInsurance) {
      return { isValid: true, errors: {} }; // Pas d'assurance = valide
    }

    // Validations obligatoires
    if (!insurance.companyCode) {
      errors.companyCode = 'La compagnie d\'assurance est obligatoire';
    }

    if (!insurance.policyNumber?.trim()) {
      errors.policyNumber = 'Le numéro de police est obligatoire';
    } else if (insurance.policyNumber.length < 3) {
      errors.policyNumber = 'Le numéro de police doit contenir au moins 3 caractères';
    }

    if (!insurance.memberNumber?.trim()) {
      errors.memberNumber = 'Le numéro d\'adhérent est obligatoire';
    }

    if (!insurance.planType?.trim()) {
      errors.planType = 'Le type de plan est obligatoire';
    }

    if (!insurance.coverageRate || insurance.coverageRate <= 0 || insurance.coverageRate > 100) {
      errors.coverageRate = 'Le taux de couverture doit être entre 1 et 100%';
    }

    if (!insurance.validUntil) {
      errors.validUntil = 'La date d\'expiration est obligatoire';
    } else {
      const expirationDate = new Date(insurance.validUntil);
      const today = new Date();
      if (expirationDate < today) {
        errors.validUntil = 'L\'assurance est expirée';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Formate les informations d'assurance pour affichage (SANS PLAFONDS)
   * @param {Object} insurance - Données d'assurance
   * @returns {Object} Données formatées
   */
  formatInsuranceDisplay(insurance) {
    if (!insurance?.hasInsurance) {
      return {
        display: 'Aucune assurance',
        status: 'none',
        color: 'gray'
      };
    }

    const today = new Date();
    const expirationDate = new Date(insurance.validUntil);
    const isExpired = expirationDate < today;
    const isExpiringSoon = (expirationDate - today) < (30 * 24 * 60 * 60 * 1000); // 30 jours

    let status = 'active';
    let color = 'green';

    if (isExpired) {
      status = 'expired';
      color = 'red';
    } else if (isExpiringSoon) {
      status = 'expiring';
      color = 'orange';
    }

    return {
      display: `${insurance.companyName} - ${insurance.planType}`,
      policyNumber: insurance.policyNumber,
      memberNumber: insurance.memberNumber,
      coverageRate: `${insurance.coverageRate}%`,
      expirationDate: expirationDate.toLocaleDateString('fr-FR'),
      deductible: insurance.deductible ? `${insurance.deductible.toLocaleString()} FCFA` : 'Aucune',
      status,
      color,
      isExpired,
      isExpiringSoon,
      planCategory: insurance.planCategory,
      employerName: insurance.employerName
    };
  },

  /**
   * Génère un résumé de facturation pour tiers payant (SIMPLIFIÉ)
   * @param {Object} coverage - Résultat du calcul de couverture
   * @param {Object} patient - Données du patient
   * @param {Object} consultation - Données de la consultation
   * @returns {Object} Données de facturation tiers payant
   */
  generateThirdPartyBilling(coverage, patient, consultation) {
    if (!coverage.canBeCovered || coverage.insuranceCoverage <= 0) {
      return null;
    }

    return {
      invoiceDate: new Date().toISOString(),
      patientInfo: {
        fullName: `${patient.firstName} ${patient.lastName}`,
        memberNumber: patient.insurance.memberNumber,
        policyNumber: patient.insurance.policyNumber
      },
      insuranceInfo: {
        companyName: patient.insurance.companyName,
        companyCode: patient.insurance.companyCode,
        planType: patient.insurance.planType,
        coverageRate: patient.insurance.coverageRate
      },
      consultationInfo: {
        type: consultation.type,
        amount: consultation.amount,
        date: consultation.date,
        doctor: consultation.doctor
      },
      billing: {
        totalAmount: coverage.consultationAmount,
        insuranceCoverage: coverage.insuranceCoverage,
        patientPayment: coverage.patientPayment,
        deductibleApplied: coverage.deductibleApplied || 0
      }
    };
  },

  /**
   * Calcul rapide pour affichage en temps réel
   * @param {Number} amount - Montant
   * @param {Number} coverageRate - Taux de couverture (0-100)
   * @param {Number} deductible - Franchise (optionnel)
   * @returns {Object} Calcul rapide
   */
  quickCalculation(amount, coverageRate, deductible = 0) {
    if (!amount || !coverageRate) {
      return { coverage: 0, patient: amount || 0 };
    }

    let coverage = amount * (coverageRate / 100);

    // Appliquer la franchise si c'est la première consultation
    if (deductible > 0) {
      coverage = Math.max(0, coverage - deductible);
    }

    const patient = amount - coverage;

    return {
      coverage: Math.round(coverage),
      patient: Math.round(patient),
      coverageRate,
      deductibleApplied: deductible
    };
  }
};

export default insuranceCalculatorService;