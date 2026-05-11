/**
 * Service de calcul de prise en charge assurance
 */

export const insuranceCalculatorService = {

  /**
   * Calcule la prise en charge d'assurance pour une consultation
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
        remainingLimit: 0,
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
        remainingLimit: 0,
        canBeCovered: false,
        error: 'Assurance expirée',
        message: `Assurance expirée le ${expirationDate.toLocaleDateString('fr-FR')}`
      };
    }

    // Calcul du plafond restant
    const consumedAmount = patientInsurance.consumedThisYear || 0;
    const remainingLimit = patientInsurance.annualLimit - consumedAmount;

    if (remainingLimit <= 0) {
      return {
        consultationAmount,
        insuranceCoverage: 0,
        patientPayment: consultationAmount,
        coverageRate: patientInsurance.coverageRate,
        remainingLimit: 0,
        canBeCovered: false,
        error: 'Plafond atteint',
        message: 'Plafond annuel de l\'assurance atteint'
      };
    }

    // Calcul de base de la prise en charge
    let baseInsuranceCoverage = consultationAmount * (patientInsurance.coverageRate / 100);

    // Application de la franchise si applicable
    const deductible = patientInsurance.deductible || 0;
    if (deductible > 0 && consumedAmount === 0) {
      // Première consultation de l'année - appliquer la franchise
      baseInsuranceCoverage = Math.max(0, baseInsuranceCoverage - deductible);
    }

    // Limiter au plafond restant
    const actualInsuranceCoverage = Math.min(baseInsuranceCoverage, remainingLimit);

    // Calcul du reste à charge patient
    const patientPayment = consultationAmount - actualInsuranceCoverage;

    // Nouveau plafond restant après cette consultation
    const newRemainingLimit = remainingLimit - actualInsuranceCoverage;

    return {
      consultationAmount,
      insuranceCoverage: actualInsuranceCoverage,
      patientPayment,
      coverageRate: patientInsurance.coverageRate,
      remainingLimit: newRemainingLimit,
      previousConsumed: consumedAmount,
      newConsumed: consumedAmount + actualInsuranceCoverage,
      canBeCovered: actualInsuranceCoverage > 0,
      deductibleApplied: deductible > 0 && consumedAmount === 0 ? deductible : 0,
      message: actualInsuranceCoverage > 0 ?
        `Prise en charge: ${actualInsuranceCoverage.toLocaleString()} FCFA (${patientInsurance.coverageRate}%)` :
        'Aucune prise en charge possible'
    };
  },

  /**
   * Valide les données d'assurance d'un patient
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

    if (!insurance.annualLimit || insurance.annualLimit <= 0) {
      errors.annualLimit = 'Le plafond annuel doit être supérieur à 0';
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
   * Formate les informations d'assurance pour affichage
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

    const remainingLimit = insurance.annualLimit - (insurance.consumedThisYear || 0);
    const consumptionPercentage = ((insurance.consumedThisYear || 0) / insurance.annualLimit * 100).toFixed(1);

    return {
      display: `${insurance.companyName} - ${insurance.planType}`,
      policyNumber: insurance.policyNumber,
      memberNumber: insurance.memberNumber,
      coverageRate: `${insurance.coverageRate}%`,
      annualLimit: insurance.annualLimit.toLocaleString() + ' FCFA',
      remainingLimit: remainingLimit.toLocaleString() + ' FCFA',
      consumedAmount: (insurance.consumedThisYear || 0).toLocaleString() + ' FCFA',
      consumptionPercentage: `${consumptionPercentage}%`,
      expirationDate: expirationDate.toLocaleDateString('fr-FR'),
      status,
      color,
      isExpired,
      isExpiringSoon,
      planCategory: insurance.planCategory,
      employerName: insurance.employerName
    };
  },

  /**
   * Met à jour la consommation d'assurance après un paiement
   * @param {Object} insurance - Données d'assurance actuelles
   * @param {Number} amountCovered - Montant pris en charge
   * @returns {Object} Données d'assurance mises à jour
   */
  updateConsumption(insurance, amountCovered) {
    if (!insurance?.hasInsurance || amountCovered <= 0) {
      return insurance;
    }

    const newConsumed = (insurance.consumedThisYear || 0) + amountCovered;

    return {
      ...insurance,
      consumedThisYear: newConsumed,
      remainingLimit: insurance.annualLimit - newConsumed,
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Génère un résumé de facturation pour tiers payant
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
        remainingLimit: coverage.remainingLimit
      }
    };
  }
};

export default insuranceCalculatorService;