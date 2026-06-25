import type { HttpContext } from '@adonisjs/core/http'
import { SyncService } from '#services/sync_service'
import Set from '#models/set'

export default class SyncsController {

    // Affiche la liste des sets en base pour la page d'administration de la synchronisation.
    async index({ response }: HttpContext) {
        const sets = await Set.all()
        return response.json({ sets })
    }

    // Déclenche la synchronisation de tous les sets One Piece depuis l'API externe.
    // SyncService est instancié par requête (pas en singleton) car il n'a pas d'état.
    async syncSets({ response }: HttpContext) {
        const service = new SyncService()
        try {
            const result = await service.syncSets()
            return response.json({ synced: result.synced })
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message })
        }
    }

    // Déclenche la synchronisation de toutes les cartes d'un set spécifique depuis l'API externe.
    async syncCards({ params, response }: HttpContext) {
        const service = new SyncService()
        try {
            const result = await service.syncCards(params.setId)
            return response.json({ synced: result.synced })
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message })
        }
    }
}
