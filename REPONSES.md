# Réponses aux questions – Exercices 6-12

## Exercice 6 – ReferenceInput/ReferenceField

### 6.1 Différence entre `<ReferenceInput>` et `<ReferenceField>`

| Aspect | ReferenceInput | ReferenceField |
|--------|---|---|
| **Contexte d'utilisation** | Formulaires (Create/Edit) | Vues détail (Show) ou listes |
| **Interaction utilisateur** | Dropdown/Autocomplete sélectionnable | Texte en lecture seule (souvent lien cliquable) |
| **Récupération des données** | Requête `useGetList` sur la ressource référencée | Requête `useGetOne` sur la ressource référencée |
| **Validation** | Peut valider la sélection | Aucune validation |
| **React-Admin hooks** | Gère en interne via `<SelectInput>` | Affiche la valeur référencée |

### 6.2 Pourquoi utiliser une ressource au lieu d'un `<SelectInput>` statique?

**Raison : Données dynamiques et cohérence**

- **Ressource dynamique** : Les valeurs (managers) changent au fil du temps. Avec une ressource, on récupère toujours les données actuelles de la base.
- **Filtrage possible** : On peut filter les managers (ex: `{ actif: true, departement: formData.departement }`) pour afficher seulement les managers pertinents.
- **Maintenabilité** : Si les managers changent, pas besoin de toucher le code du formulaire ; les nouvelles données sont chargées automatiquement.
- **Avec SelectInput statique** : On aurait une liste codée en dur (ex: `choices={[{ id: 1, name: "John" }]}`), impossible à mettre à jour sans redéployer le code.

**Exemple** : Dans InternCreate, on filter les managers par département :
```tsx
filter={{ actif: true, departement: formData.departement }}
```
Impossible avec un SelectInput statique.

---

## Exercice 7 – InternCreate & InternEdit avec FormDataConsumer

### 7.1 Pourquoi `useFormState()` au niveau composant cause une erreur?

**Erreur** : `can't access property '_formState', control is null`

**Cause** : `useFormState()` nécessite le contexte React-Hook-Form (FormProvider/RHF) fourni par `<SimpleForm>`. Cependant :
- `useFormState()` appelé au niveau racine du composant cherche ce contexte immédiatement
- Le contexte n'est pas encore établi car on est en dehors de `<SimpleForm>`
- Résultat : `control` est `null`, d'où l'erreur

**Solution** : Utiliser `<FormDataConsumer>` qui s'exécute **à l'intérieur** du contexte `<SimpleForm>` :
```tsx
<SimpleForm>
  <FormDataConsumer>
    {({ formData }) => (
      <NumberInput validate={validateSalary(formData)} />
    )}
  </FormDataConsumer>
</SimpleForm>
```

`FormDataConsumer` garantit que l'accès au `formData` se fait dans le bon contexte.

### 7.2 Stratégie pour rendre `salaire` dynamique (obligatoire si `remunerer === true`)

**Pattern** : FormDataConsumer + fonction de validation conditionnelle

```tsx
const validateSalary = (formData) => {
  return formData.remunerer ? required() : undefined;
};

// Dans le formulaire :
<FormDataConsumer>
  {({ formData }) => (
    <NumberInput
      source="salaire"
      label="Salaire"
      validate={validateSalary(formData)}
    />
  )}
</FormDataConsumer>
```

**Comment ça marche** :
1. `FormDataConsumer` observe tous les changements du formulaire
2. Chaque fois que `formData` change, la fonction de validation est recalculée
3. Si `remunerer` passe de `false` à `true`, `salaire` devient obligatoire
4. Le champ affiche un indicateur `*` (requis) et refuse la soumission si vide

**Avantage** : Réactivité en temps réel, UX fluide.

---

## Exercice 8 – InternShow & ManagerCard avec useGetOne

### 8.1 Pourquoi utiliser `useGetOne` au lieu de ReferenceField?

| Aspect | useGetOne | ReferenceField |
|--------|---|---|
| **Contrôle** | Complet (état isPending, error) | Limité |
| **Affichage** | Personnalisé avec MUI Card, composants custom | Préformaté (TextField) |
| **Gestion d'erreurs** | Explicite : `if (error) return <ErrorMessage />` | Gérée en interne (moins visible) |
| **Layout** | Flexible (Card, Grid, Box, etc.) | Structure fixe |

**Exemple comparé** :

```tsx
// ReferenceField (simple mais limité)
<ReferenceField source="managerId" reference="employees">
  <TextField source="name" />
</ReferenceField>

// useGetOne (contrôle complet)
const { data: manager, isPending, error } = useGetOne("employees", { id: managerId });
if (isPending) return <Skeleton />;
if (error) return <Alert severity="error">Erreur</Alert>;
return (
  <Card>
    <CardContent>
      <Typography>{manager.firstname} {manager.lastname}</Typography>
      <Link href={`mailto:${manager.email}`}>{manager.email}</Link>
      <Chip label={manager.actif ? "Actif" : "Inactif"} />
    </CardContent>
  </Card>
);
```

### 8.2 Pourquoi `{ enabled: !!managerId }` est crucial dans useGetOne?

**Problème sans `enabled`** :
```tsx
useGetOne("employees", { id: undefined }); // ❌ Requête inutile à /employees/undefined
```

**Avec `enabled: !!managerId`** :
```tsx
useGetOne("employees", { id: managerId }, { enabled: !!managerId });
// ✅ Si managerId est undefined/null, la requête n'est pas exécutée
```

**Bénéfices** :
- Évite les erreurs 404 (fetch /employees/undefined)
- Économise la bande passante
- Prévient les logs d'erreur inutiles
- Permet d'afficher un état "En attente de sélection" au lieu d'une erreur

---

## Exercice 9 – EmployeeShow avec InternsByManager & DepartmentStats

### 9.1 Pattern : useGetList avec filtre et `{ enabled: condition }`

**InternsByManager** (affiche les stagiaires d'un manager) :
```tsx
const { data: interns, total, isPending, error } = useGetList(
  "interns",
  {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "id", order: "ASC" },
    filter: { managerId } // Filtre par ID du manager
  },
  { enabled: !!managerId } // Ne fetch que si managerId existe
);
```

**DepartmentStats** (compte les collègues actifs du même département) :
```tsx
const { total: colleagueCount, isPending, error } = useGetList(
  "employees",
  {
    pagination: { page: 1, perPage: 1 }, // ⭐ Optimisation : perPage: 1 suffit pour le count
    sort: { field: "id", order: "ASC" },
    filter: { departement, actif: true } // Filtre par département et statut
  },
  { enabled: !!departement }
);
```

### 9.2 Pourquoi `perPage: 1` pour DepartmentStats?

**Raison : Optimisation de la requête**

- **Besoin réel** : On veut seulement le **nombre total** d'employés (`total`) du département
- **Sans optimisation** : `perPage: 100` → backend envoie jusqu'à 100 enregistrements complets (nom, email, salaire, etc.)
- **Avec `perPage: 1`** : backend envoie seulement 1 enregistrement (ou 0) mais inclut le `total`

**Comparaison** :

```
Request 1: GET /employees?filter={"departement":"IT","actif":true}&pagination=1,100
Response: [
  { id: 1, name: "Alice", email: "...", salaire: 50000, ... },
  { id: 2, name: "Bob", ... },
  ... (100 entrées complètes)
]
Total: 45

Request 2 (optimisé): GET /employees?filter=...&pagination=1,1
Response: [
  { id: 1, name: "Alice", ... }
]
Total: 45  ← Même information avec 99× moins de données!
```

**Impact** :
- Latence réseau réduite
- Bande passante économisée
- Serveur soulagé
- UX inchangée (on affiche juste le chiffre "45")

---

## Exercice 10 – QuickStatusToggle avec useUpdate

### 10.1 Pourquoi `previousData` est essentiel dans useUpdate?

**Sans `previousData`** :
```tsx
update("employees", { id, data: { actif: !record.actif } });
// ❌ Si la requête échoue ou est lente, l'UI reste dans un état incohérent
```

**Avec `previousData`** :
```tsx
update("employees", {
  id,
  data: { actif: !record.actif },
  previousData: record // ✅ Permet un rollback en cas d'erreur
});
```

**Bénéfices** :
- **Rollback automatique** : Si la mutation échoue, React-Query peut revenir à l'état précédent
- **Optimistic updates** : Le serveur met à jour l'état, ou revient à `previousData` en cas d'erreur
- **UX fluide** : Pas de "flash" d'état incorrect

### 10.2 Avantages de `mutationMode: "pessimistic"` pour QuickStatusToggle

```tsx
update("employees", { id, data: { actif: !record.actif } }, {
  mutationMode: "pessimistic" // ← Attendre la confirmation du serveur
});
```

**Modes disponibles** :
- **pessimistic** : Attendre que le serveur valide avant mettre à jour l'UI
- **optimistic** : Mettre à jour l'UI immédiatement, puis vérifier le serveur
- **undoable** : Mettre à jour l'UI, avec option "Annuler" pendant N secondes

**Pour QuickStatusToggle, "pessimistic" est idéal** car :
- Le toggle est une opération simple et atomique
- Si le serveur refuse (ex: permissions), l'utilisateur voit l'état correct
- Évite les bugs de synchronisation avec une unique bascule de statut

---

## Exercice 11 – QuickInternCreateButton avec useCreate & useRefresh

### 11.1 Différence entre `<Create>` component et `useCreate()` hook

| Aspect | `<Create>` composant | `useCreate()` hook |
|--------|---|---|
| **Contexte** | Page/route dédiée | Modal, formulaire inline, n'importe où |
| **Formulaire** | Via `<SimpleForm>` intégré | À construire soi-même ou utiliser directement |
| **Redirection** | Automatique après succès | À gérer manuellement |
| **Affichage** | Remplace toute la page | Discret (modal, notification, etc.) |

**Exemple useCreate** :
```tsx
const [create, { isPending }] = useCreate();

const handleSubmit = async () => {
  create("interns", { data: { firstname, lastname, ... } },
    {
      onSuccess: () => {
        notify("Stagiaire créé!");
        closeModal();
        refresh(); // Recharger la liste
      },
      onError: (error) => setError(error.message)
    }
  );
};
```

### 11.2 Pourquoi `useRefresh()` après création réussie?

**Sans refresh** :
```tsx
create("interns", { data: {...} }, {
  onSuccess: () => closeModal()
  // ❌ InternList affiche toujours l'ancienne liste, sans le nouvel intern
});
```

**Avec refresh** :
```tsx
create("interns", { data: {...} }, {
  onSuccess: () => {
    refresh(); // ✅ Recharge InternList
    closeModal();
  }
});
```

**Alternatives** :
- **`useQueryClient().invalidateQueries({ queryKey: ["interns"] })`** : Plus explicite, invalide le cache
- **`refresh()`** : Plus simple, recharge tous les caches de la page
- **Mode `refetchOnWindowFocus`** : Dans useQuery options (moins fiable)

**Pour QuickInternCreateButton**, `useRefresh()` est simple et efficace.

---

## Exercice 12 – Dashboard avec useGetList

### 12.1 Les 4 appels useGetList se font-ils en parallèle ou en séquence?

**Réponse : EN PARALLÈLE ✅**

```tsx
// Tous déclarés au même niveau du composant
const { total: totalEmployees, isPending: loadingTotalEmployees, ... } = useGetList("employees", ...);
const { total: activeEmployees, isPending: loadingActiveEmployees, ... } = useGetList("employees", { filter: { actif: true } }, ...);
const { total: totalInterns, isPending: loadingTotalInterns, ... } = useGetList("interns", ...);
const { total: paidInterns, isPending: loadingPaidInterns, ... } = useGetList("interns", { filter: { remunerer: true } }, ...);
```

**Pourquoi** :
1. Tous les hooks sont appelés au même niveau (pas de conditions, pas de `.then()`)
2. React-Query les exécute **simultanément** au rendu du composant
3. Aucune dépendance entre les requêtes (pas besoin d'attendre l'une avant l'autre)

**Temps total** :
- Séquentiel : 4 requêtes × 200ms = 800ms
- Parallèle : max(200ms, 200ms, 200ms, 200ms) = 200ms ✅

**Avantage** : Dashboard charge **4 fois plus vite** qu'en séquentiel.

### 12.2 Pourquoi `perPage: 1` est préférable à `perPage: 100`?

**Besoin** : Afficher le **nombre d'enregistrements** (total), pas les données elles-mêmes

**Comparaison** :

| Paramètre | `perPage: 1` | `perPage: 100` |
|---|---|---|
| **Données reçues** | 1 enregistrement (ou 0) | Jusqu'à 100 enregistrements |
| **Total reçu** | ✅ Oui | ✅ Oui |
| **Bande passante** | ~1KB | ~50-100KB |
| **Temps serveur** | Très rapide | Lent (tri, filtre sur 100 items) |
| **Temps client** | Instantané | Peut être lent (parsing 100 items) |

**Exemple JSON** :

```json
// perPage: 1
{
  "data": [
    { "id": 1, "firstname": "Alice", ... }
  ],
  "total": 42
}

// perPage: 100
{
  "data": [
    { "id": 1, "firstname": "Alice", ... },
    { "id": 2, "firstname": "Bob", ... },
    ... (100 items complets, inutiles!)
  ],
  "total": 42
}
```

**Impact** :
- Économie de bande passante : **50-100×**
- Réduction latence : ~50-100ms par requête
- Charge serveur : ↓↓ (moins de tri, moins d'I/O)
- UX : Identique (on affiche juste "42")

**Règle d'or** : `perPage: 1` pour les **count-only** queries.

---

## Résumé des hooks utilisés (Exercices 6-12)

| Hook | Exercice | Composant | Cas d'usage |
|------|---|---|---|
| **useRecordContext** | 8, 9, 10 | InternTitle, ManagerCard, InternsByManager, QuickStatusToggle | Accéder à l'enregistrement actuel du contexte (row, show) |
| **useGetOne** | 8 | ManagerCard | Charger UN enregistrement (manager d'un stagiaire) |
| **useGetList** | 9, 12 | InternsByManager, DepartmentStats, Dashboard | Charger une LISTE d'enregistrements (filtrée) |
| **useCreate** | 11 | QuickInternCreateButton | Créer un nouvel enregistrement depuis une modal |
| **useUpdate** | 10 | QuickStatusToggle | Mettre à jour un enregistrement (actif toggle) |
| **useRefresh** | 11 | QuickInternCreateButton | Recharger la liste après création |
| **useNotify** | 11 | QuickInternCreateButton | Afficher un toast de succès/erreur |

---

## Checklist finale – Exercice 13

- [x] App.tsx déclare 2 ressources (employees, interns)
- [x] Chaque ressource a 4 vues (list, create, edit, show)
- [x] Dashboard est page d'accueil (`dashboard={Dashboard}`)
- [x] CRUD stagiaires complet (list, create, edit, show, delete)
- [x] ReferenceField et ReferenceInput fonctionnels
- [x] Validation conditionnelle (FormDataConsumer)
- [x] ManagerCard gère isPending/error/data
- [x] InternsByManager affiche total + liste
- [x] DepartmentStats optimisée (`perPage: 1`)
- [x] QuickStatusToggle bascule sans rechargement
- [x] Modale création rapide (useCreate) fonctionnelle
- [x] Dashboard 4 indicateurs
- [x] Tous les hooks utilisés correctement
- [x] REPONSES.md complète

**Status** : ✅ **PRÊT POUR SOUMISSION**

