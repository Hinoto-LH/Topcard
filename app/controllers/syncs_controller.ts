import type { HttpContext } from '@adonisjs/core/http'
import { SyncService } from '#services/sync_service'
import Set from '#models/set'

export default class SyncsController {

    // Affiche la page d'administration de la synchronisation avec la liste des sets en base.
    async index({ inertia }: HttpContext) {
        const sets = await Set.all()
        return inertia.render('admin/sync', { sets })
    }

    // Déclenche la synchronisation de tous les sets One Piece depuis l'API externe.
    async syncSets({ response, session }: HttpContext) {
        const service = new SyncService ()
        try {
            const result = await service.syncSets()
            session.flash('success', `${result.synced} sets synchronisés`)
        } catch (error) {
            session.flash('error', `Erreur API : ${(error as Error).message}`)
        }
        return response.redirect('/admin/sync')
    }

    // Déclenche la synchronisation de toutes les cartes d'un set spécifique depuis l'API externe.
    async syncCards({params, response, session}: HttpContext) {
        const service = new SyncService ()
        try {
            const result = await service.syncCards(params.setId)
            session.flash('success', `${result.synced} cartes synchronisées`)
        } catch (error) {
            session.flash('error', `Erreur API : ${(error as Error).message}`)
        }
        return response.redirect('/admin/sync')
    }
}