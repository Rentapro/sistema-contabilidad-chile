/**
 * Configuración NextAuth para Sistema Contabilidad Chile
 * Autenticación empresarial real con Supabase
 */

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
        empresaId: { label: 'ID Empresa', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar usuario en Supabase
          const { data: usuario, error } = await supabase
            .from('usuarios')
            .select(`
              *,
              empresa:empresas(*)
            `)
            .eq('email', credentials.email)
            .eq('activo', true)
            .single()

          if (error || !usuario) {
            console.error('Usuario no encontrado:', error)
            return null
          }

          // Verificar contraseña
          const passwordValida = await bcrypt.compare(
            credentials.password,
            usuario.password_hash
          )

          if (!passwordValida) {
            console.error('Contraseña incorrecta')
            return null
          }

          // Verificar empresa activa
          if (!usuario.empresa.activa) {
            console.error('Empresa inactiva')
            return null
          }

          // Actualizar último acceso
          await supabase
            .from('usuarios')
            .update({ ultimo_acceso: new Date().toISOString() })
            .eq('id', usuario.id)

          return {
            id: usuario.id,
            email: usuario.email,
            name: `${usuario.nombre} ${usuario.apellido}`,
            role: usuario.rol,
            empresaId: usuario.empresa_id,
            empresa: usuario.empresa
          }
        } catch (error) {
          console.error('Error en autenticación:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60 // 8 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.empresaId = user.empresaId
        token.empresa = user.empresa
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.empresaId = token.empresaId
      session.user.empresa = token.empresa
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
})

export { handler as GET, handler as POST }
